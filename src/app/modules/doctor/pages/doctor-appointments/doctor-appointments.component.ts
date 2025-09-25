import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DoctorCitation } from '../../../../../../src/app/shared/Models/hospital/DoctorListModel'; // o donde tengas la interfaz
import { ConfirmAttendanceDialogComponent, ConfirmResult } from '../dialogs/confirm-attendance/confirm-attendance.dialog';
import { ClinicalNotesDialogComponent } from '../dialogs/clinical-notes/clinical-notes.dialog';
import { DoctorService } from '../../../../shared/services/doctor.service';
import { CitationService } from '../../../../shared/services/citation.service';
import { AuthService } from '../../../../shared/services/auth/auth.service';

type MaybeDate = string | number | Date;

@Component({
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css'],
  standalone: false
})
export class DoctorAppointmentsComponent implements OnInit, OnDestroy {

  // TODO: reemplazar por token
  // private readonly DOCTOR_ID = 1;
    DOCTOR_ID! : number

  loading = false;
  errorMsg = '';
  selectedDate = new Date();                   // filtro por fecha
  morning: DoctorCitation[] = [];
  afternoon: DoctorCitation[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private citationsDoctor: DoctorService,
    private citations : CitationService,
    private dialog: MatDialog,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
     const doctorId = this.authService.getDoctorId();
    if(doctorId){
    this.DOCTOR_ID = doctorId;
    }
    this.loadForDate(this.selectedDate);
   

  }

  ngOnDestroy(): void {
    this.destroy$.next(); this.destroy$.complete();
  }

  // === Carga y partición en mañana/tarde ===
  loadForDate(d: Date) {
    this.loading = true; this.errorMsg = '';
    this.citationsDoctor.getCitationsByDoctor(this.DOCTOR_ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (all: DoctorCitation[]) => {
          const sameDay = all.filter(c => this.sameDay(new Date(c.appointmentDate as MaybeDate), d));

          // Marcar automáticamente como "No asistió" las citas expiradas que no están atendidas
          const expiredUnattended = sameDay.filter(c => this.isProgrammed(c.state) && this.isExpired(c));
          if (expiredUnattended.length > 0) {
            expiredUnattended.forEach(c => {
              this.citations.updateCitation({ id: c.id, state: 'No asistió', note: c.note || '' }).subscribe();
            });
          }

          const programadas = sameDay.filter(c => this.isProgrammed(c.state) && !this.isExpired(c));
          const [am, pm] = this.partitionMorningAfternoon(programadas);
          this.morning = am.sort((a,b) => a.timeBlock.localeCompare(b.timeBlock));
          this.afternoon = pm.sort((a,b) => a.timeBlock.localeCompare(b.timeBlock));
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'No fue posible cargar tus citas.';
          this.loading = false;
        }
      });
  }

  sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
  }

isProgrammed(state = ''): boolean {
  const s = state.toLowerCase().trim();
  return ['pendiente', 'agendada', 'programada'].includes(s);
}


  isExpired(c: DoctorCitation): boolean {
    // vencida si la hora ya pasó (ahora) y sigue en estado “programado”
    const now = new Date();
    const d = new Date(c.appointmentDate as MaybeDate);
    const [hh,mm] = c.timeBlock.split(':').map(n => +n);
    d.setHours(hh, mm, 0, 0);
    return d.getTime() < now.getTime();
  }
partitionMorningAfternoon(list: DoctorCitation[]): [DoctorCitation[], DoctorCitation[]] {
  const am: DoctorCitation[] = [];
  const pm: DoctorCitation[] = [];
  for (const c of list) {
    const [hh, mm] = c.timeBlock.split(':').map(n => +n);
    const minutes = hh * 60 + mm;

    // Mañana: 07:00–11:59
    if (minutes >= 7*60 && minutes < 12*60) {
      am.push(c);
    } 
    // Tarde: 12:00–18:59
    else if (minutes >= 12*60 && minutes < 23*60) {
      pm.push(c);
    }
  }
  return [am, pm];
}


  // calendario del card (lo que ya tienes): cambia selectedDate y recarga
  onPickDate(d: Date) {
    this.selectedDate = d;
    this.loadForDate(d);
  }

  // === Flujo Atender ===
  async handleAttend(c: DoctorCitation) {
    // 1) Confirmación (asistió / no asistió)
    const confirmRef = this.dialog.open<ConfirmAttendanceDialogComponent, any, ConfirmResult>(
      ConfirmAttendanceDialogComponent,
      { width: '540px', data: { citation: c }, disableClose: true }
    );
    const confirmRes = await confirmRef.afterClosed().toPromise();
    if (!confirmRes) return; // canceló

    // 2) Observaciones clínicas
    const notesRef = this.dialog.open<ClinicalNotesDialogComponent, any, string>(
      ClinicalNotesDialogComponent,
      { width: '900px', maxWidth: '95vw', data: { citation: c, attended: confirmRes.attended }, disableClose: true }
    );
    const note = await notesRef.afterClosed().toPromise();   // puede venir vacío

    // 3) Actualizar backend
    const newState = confirmRes.attended ? 'Atendida' : 'No asistió';
    this.loading = true;
    const updateData = {
      id: c.id,
      state: newState,
      note: note ?? ''
    };
    this.citations.updateCitation(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: confirmRes.attended ? 'success' : 'info',
            title: confirmRes.attended ? 'Cita atendida' : 'Cita marcada como no asistida',
            text: confirmRes.attended ? 'Se guardaron las observaciones.' : 'Se registró la inasistencia.',
            confirmButtonText: 'OK'
          });
          // 4) refrescar listas (sale de programadas)
          this.loadForDate(this.selectedDate);
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'No se pudo actualizar la cita',
            text: 'Intenta de nuevo.',
          });
        }
      });
  }

  // utilidades UI
  hourLabel(timeBlock: string): string {
    const [h, m] = timeBlock.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  patientName(c: any) {
    return c.patientName || 'Paciente';
  }

  typeName(c: any) {
    return c.typeCitationName || 'Control';
  }
}
