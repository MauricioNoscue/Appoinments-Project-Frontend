import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { CitationList } from '../../../../shared/Models/newdoctor';
import { CitationService } from '../../../../shared/services/citation.service';
import { AuthService } from '../../../../shared/services/auth/auth.service';

import { ConfirmAttendanceDialogComponent, ConfirmResult } from '../dialogs/confirm-attendance/confirm-attendance.dialog';
import { ClinicalNotesDialogComponent } from '../dialogs/clinical-notes/clinical-notes.dialog';
import { DoctorNewService } from '../../../../shared/services/Hospital/doctor-new.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css'],
  standalone: false
})
export class DoctorAppointmentsComponent implements OnInit, OnDestroy {

  DOCTOR_ID!: number;

  loading = false;
  errorMsg = '';
  selectedDate = new Date();

  morning: CitationList[] = [];
  afternoon: CitationList[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private doctorSrv: DoctorNewService,
    private citationSrv: CitationService,
    private dialog: MatDialog,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  const id = this.auth.getDoctorId();
  if (!id) return;

  this.DOCTOR_ID = id;

  this.route.paramMap.subscribe(params => {
    const dateParam = params.get('date');

    if (dateParam) {
      this.selectedDate = new Date(dateParam);
    }

    this.loadForDate(this.selectedDate);
  });
}


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================================
  // Cargar citas del doctor por fecha
  // ==========================================================
  loadForDate(date: Date) {
    this.loading = true;
    this.errorMsg = '';

    const isoDate = date.toISOString().slice(0, 10);

    this.doctorSrv.getCitationsByDoctor(this.DOCTOR_ID, isoDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items: CitationList[]) => {
          this.loading = false;

          // dividir citas por jornada
          const [am, pm] = this.partitionMorningAfternoon(items);

          this.morning = am;
          this.afternoon = pm;
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'No fue posible cargar tus citas.';
        }
      });
  }

  // ==========================================================
  // Dividir citas por mañana y tarde
  // ==========================================================
  private partitionMorningAfternoon(list: CitationList[]): [CitationList[], CitationList[]] {
    const morning: CitationList[] = [];
    const afternoon: CitationList[] = [];

    for (const c of list) {
      const [hh, mm] = c.timeBlock!.split(':').map(Number);
      const minutes = hh * 60 + mm;

      if (minutes >= 7 * 60 && minutes < 12 * 60)
        morning.push(c);
      else if (minutes >= 12 * 60 && minutes <= 18 * 60)
        afternoon.push(c);
    }

    // ordenar
    morning.sort((a, b) => a.timeBlock!.localeCompare(b.timeBlock!));
    afternoon.sort((a, b) => a.timeBlock!.localeCompare(b.timeBlock!));

    return [morning, afternoon];
  }

  // ==========================================================
  // Flujo "Atender"
  // ==========================================================
  async handleAttend(c: CitationList) {
    // 1. Dialog de confirmación
    const confirmRef = this.dialog.open<ConfirmAttendanceDialogComponent, any, ConfirmResult>(
      ConfirmAttendanceDialogComponent,
      { width: '540px', disableClose: true, data: { citation: c } }
    );

    const confirm = await confirmRef.afterClosed().toPromise();
    if (!confirm) return;

    // 2. Notas clínicas
    const notesRef = this.dialog.open<ClinicalNotesDialogComponent, any, string>(
      ClinicalNotesDialogComponent,
      { width: '900px', maxWidth: '95vw', disableClose: true, data: { citation: c, attended: confirm.attended } }
    );

    const note = await notesRef.afterClosed().toPromise() ?? '';

    // 3. Actualizar estado
    const update = {
      id: c.id,
      statustypesId: confirm.attended ? 4 : 3,
      note: note,
      reltedPersonId: null
    };

    this.loading = true;

    this.citationSrv.actualizar(update)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;

          Swal.fire({
            icon: confirm.attended ? 'success' : 'info',
            title: confirm.attended ? 'Cita atendida' : 'Cita marcada como no asistida',
            text: confirm.attended ? 'Se guardaron las notas clínicas.' : 'Se registró la inasistencia.',
          });

          this.loadForDate(this.selectedDate);
        },
        error: () => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'No se pudo actualizar la cita',
            text: 'Intenta de nuevo.',
          });
        }
      });
  }

  // ==========================================================
  // UI helpers
  // ==========================================================
 hourLabel(timeBlock: string | null): string {
  if (!timeBlock) return '— —'; // devuelve algo seguro para el split

  const [hh, mm] = timeBlock.split(':').map(Number);
  const d = new Date();
  d.setHours(hh, mm, 0);

  return d.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

  patientName(c: CitationList) {
    return c.patientName || 'Paciente';
  }

  typeName(c: CitationList) {
    return  'Control';
  }

  onPickDate(d: Date) {
    this.selectedDate = d;
    this.loadForDate(d);
  }
}
