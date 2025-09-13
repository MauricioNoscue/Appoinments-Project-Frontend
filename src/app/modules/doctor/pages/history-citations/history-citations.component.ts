import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DoctorService} from '../../../../shared/services/doctor.service';
import { DoctorCitation } from '../../../../shared/Models/hospital/DoctorListModel';
import { DatePipe } from '@angular/common';
import { CitationDetailsDialogComponent } from './citation-details-dialog/citation-details-dialog.component';

type StatusKey = 'atendida' | 'noasistio' | 'pendiente' | 'cancelada' | 'reprogramada' | 'otro';

@Component({
  selector: 'app-history-citations',
  templateUrl: './history-citations.component.html',
  styleUrls: ['./history-citations.component.css'],
  providers: [DatePipe],
  standalone: false
})
export class HistoryCitationsComponent implements OnInit, OnDestroy {

  // TODO: cuando exista autenticación por token, reemplazar por el id real del doctor
  private readonly DOCTOR_ID = 4;

  loading = false;
  errorMsg = '';
  items: DoctorCitation[] = [];

  // contadores
  countAtendidas = 0;
  countNoAsistio = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private doctorService: DoctorService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
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
          // orden: más recientes primero
          this.items = [...res].sort((a, b) =>
            new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
          );
          // contadores
          this.countAtendidas = this.items.filter(c => this.mapState(c.state) === 'atendida').length;
          this.countNoAsistio  = this.items.filter(c => this.mapState(c.state) === 'noasistio').length;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'No fue posible cargar el historial de citas.';
          this.loading = false;
        }
      });
  }

  // Normaliza estados desde backend a claves de UI
  mapState(raw: string): StatusKey {
    const s = (raw || '').trim().toLowerCase();
    if (['atendida', 'atendido', 'hecha', 'completada'].includes(s)) return 'atendida';
    if (['no asistio', 'noasistio', 'incomparecencia', 'ausente'].includes(s)) return 'noasistio';
    if (['pendiente', 'agendada', 'programada'].includes(s)) return 'pendiente';
    if (['cancelada', 'anulada'].includes(s)) return 'cancelada';
    if (['reprogramada', 'reagendada'].includes(s)) return 'reprogramada';
    return 'otro';
  }

  // Etiqueta para la pill
  stateLabel(c: DoctorCitation): string {
    switch (this.mapState(c.state)) {
      case 'atendida':    return 'Atendido';
      case 'noasistio':   return 'No Asistio';
      case 'pendiente':   return 'Pendiente';
      case 'cancelada':   return 'Cancelada';
      case 'reprogramada':return 'Reprogramada';
      default:            return c.state || '—';
    }
  }

  // Clase de estilo de la pill
  stateClass(c: DoctorCitation): string {
    switch (this.mapState(c.state)) {
      case 'atendida':    return 'pill pill--ok';
      case 'noasistio':   return 'pill pill--warn';
      case 'pendiente':   return 'pill pill--pending';
      case 'cancelada':   return 'pill pill--cancel';
      case 'reprogramada':return 'pill pill--info';
      default:            return 'pill';
    }
  }

  // Formatos de fecha y hora al estilo del mockup
  formatDateISO(iso: string): string {
    return this.datePipe.transform(iso, 'dd/MM/yy') || '—';
  }
  formatHour(hhmmss: string): string {
    // hh:mm (24h)
    return (hhmmss || '').slice(0,5);
  }

  // click en "Detalles" - abre modal con detalles completos
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
