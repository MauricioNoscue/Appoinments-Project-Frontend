import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DoctorCitation } from '../../../../../shared/Models/hospital/DoctorListModel';

type StatusKey = 'atendida' | 'noasistio' | 'pendiente' | 'cancelada' | 'reprogramada' | 'otro';

@Component({
  selector: 'app-citation-details-dialog',
  standalone: false,
  templateUrl: './citation-details-dialog.component.html',
  styleUrl: './citation-details-dialog.component.css',
  providers: [DatePipe]
})
export class CitationDetailsDialogComponent {

  constructor(
    private ref: MatDialogRef<CitationDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { citation: DoctorCitation },
    private datePipe: DatePipe
  ) {}

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
  stateLabel(): string {
    switch (this.mapState(this.data.citation.state)) {
      case 'atendida':    return 'Atendido';
      case 'noasistio':   return 'No Asistio';
      case 'pendiente':   return 'Pendiente';
      case 'cancelada':   return 'Cancelada';
      case 'reprogramada':return 'Reprogramada';
      default:            return this.data.citation.state || '—';
    }
  }

  // Clase de estilo de la pill
  stateClass(): string {
    switch (this.mapState(this.data.citation.state)) {
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

  close(): void {
    this.ref.close();
  }
}
