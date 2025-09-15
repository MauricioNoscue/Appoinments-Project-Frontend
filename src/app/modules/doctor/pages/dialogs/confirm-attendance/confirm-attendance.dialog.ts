import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DoctorCitation } from '../../../../../shared/Models/hospital/DoctorListModel';

export interface ConfirmResult { attended: boolean; }

@Component({
  selector: 'app-confirm-attendance-dialog',
  templateUrl: './confirm-attendance.dialog.html',
  styleUrls: ['./confirm-attendance.dialog.css'],
  standalone: false
})
export class ConfirmAttendanceDialogComponent {
  attended?: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { citation: DoctorCitation },
    private ref: MatDialogRef<ConfirmAttendanceDialogComponent, ConfirmResult>
  ) {}

  hourRange(): string {
    const [h, m] = this.data.citation.timeBlock.split(':').map(Number);
    const start = new Date(); start.setHours(h,m);
    const end = new Date(start.getTime() + 10*60*1000); // +10min (ajústalo)
    const f = (d:Date)=> d.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit',hour12:false});
    return `Inicio ${f(start)} - Fin ${f(end)}`;
  }

  close(){ this.ref.close(); }
  next(){ if(this.attended!==undefined) this.ref.close({ attended: this.attended }); }
}
