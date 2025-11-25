import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DoctorService } from '../../../../shared/services/doctor.service';
import { DoctorCitation } from '../../../../shared/Models/hospital/DoctorListModel';
import { DatePipe } from '@angular/common';
import { CitationDetailsDialogComponent } from './citation-details-dialog/citation-details-dialog.component';
import { AuthService } from '../../../../shared/services/auth/auth.service';

type StatusKey = 'atendida' | 'noasistio' | 'pendiente' | 'cancelada' | 'reprogramada' | 'otro';

@Component({
  selector: 'app-history-citations',
  templateUrl: './history-citations.component.html',
  styleUrls: ['./history-citations.component.css'],
  providers: [DatePipe],
  standalone: false
})
export class HistoryCitationsComponent implements OnInit, OnDestroy {

  DOCTOR_ID!: number;

  loading = false;
  errorMsg = '';
  items: DoctorCitation[] = [];

  // paginación
  page = 1;
  pageSize = 4; // cantidad por página
  pagedItems: DoctorCitation[] = [];

  // contadores
  countAtendidas = 0;
  countNoAsistio = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private doctorService: DoctorService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const doctorId = this.authService.getDoctorId();
    if (doctorId) this.DOCTOR_ID = doctorId;
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private load(): void {
    this.loading = true;
    this.errorMsg = '';

    this.doctorService.getCitationsByDoctor(this.DOCTOR_ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          const futureOrToday = res.filter(c => {
            const date = new Date(c.appointmentDate);
            date.setHours(0, 0, 0, 0);
            return date.getTime() >= now.getTime();
          });

          const past = res.filter(c => {
            const date = new Date(c.appointmentDate);
            date.setHours(0, 0, 0, 0);
            return date.getTime() < now.getTime();
          });

          futureOrToday.sort((a, b) => {
            const dateA = new Date(a.appointmentDate + 'T' + a.timeBlock);
            const dateB = new Date(b.appointmentDate + 'T' + b.timeBlock);
            return dateA.getTime() - dateB.getTime();
          });

          past.sort((a, b) => {
            const dateA = new Date(a.appointmentDate + 'T' + a.timeBlock);
            const dateB = new Date(b.appointmentDate + 'T' + b.timeBlock);
            return dateB.getTime() - dateA.getTime();
          });

          this.items = [...futureOrToday, ...past];

          // contadores
          this.countAtendidas = this.items.filter(c => this.mapState(c.state) === 'atendida').length;
          this.countNoAsistio = this.items.filter(c => this.mapState(c.state) === 'noasistio').length;

          this.setPage(1);

          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'No fue posible cargar el historial de citas.';
          this.loading = false;
        }
      });
  }

  // PAGINACIÓN EN MEMORIA
  setPage(page: number): void {
    this.page = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.items.slice(start, end);
  }

  totalPages(): number {
    return Math.ceil(this.items.length / this.pageSize);
  }

  // Normaliza estados desde backend a claves de UI
  mapState(raw: string): StatusKey {
    const s = (raw || '').trim().toLowerCase();
    if (['atendida', 'atendido', 'hecha', 'completada'].includes(s)) return 'atendida';
    if (['no asistió', 'no asistio', 'noasistio', 'incomparecencia', 'ausente'].includes(s)) return 'noasistio';
    if (['pendiente', 'agendada', 'programada'].includes(s)) return 'pendiente';
    if (['cancelada', 'anulada'].includes(s)) return 'cancelada';
    if (['reprogramada', 'reagendada'].includes(s)) return 'reprogramada';
    return 'otro';
  }

  stateLabel(c: DoctorCitation): string {
    switch (this.mapState(c.state)) {
      case 'atendida': return 'Atendido';
      case 'noasistio': return 'No Asistió';
      case 'pendiente': return 'Pendiente';
      case 'cancelada': return 'Cancelada';
      case 'reprogramada': return 'Reprogramada';
      default: return c.state || '—';
    }
  }

  stateClass(c: DoctorCitation): string {
    switch (this.mapState(c.state)) {
      case 'atendida': return 'pill pill--ok';
      case 'noasistio': return 'pill pill--warn';
      case 'pendiente': return 'pill pill--pending';
      case 'cancelada': return 'pill pill--cancel';
      case 'reprogramada': return 'pill pill--info';
      default: return 'pill';
    }
  }

  formatDateISO(iso: string): string {
    return this.datePipe.transform(iso, 'dd/MM/yy') || '—';
  }

  formatHour(hhmmss: string): string {
    return (hhmmss || '').slice(0, 5);
  }

  openDetails(c: DoctorCitation): void {
    this.dialog.open(CitationDetailsDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
      hasBackdrop: true,
      data: { citation: c }
    });
  }
}
