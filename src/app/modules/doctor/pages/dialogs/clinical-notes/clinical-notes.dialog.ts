import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DoctorCitation } from '../../../../../shared/Models/hospital/DoctorListModel';

@Component({
  selector: 'app-clinical-notes-dialog',
  templateUrl: './clinical-notes.dialog.html',
  styleUrls: ['./clinical-notes.dialog.css'],
  standalone: false
})
export class ClinicalNotesDialogComponent {

  text = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { citation: DoctorCitation; attended: boolean },
    private ref: MatDialogRef<ClinicalNotesDialogComponent, string>
  ) {}

  save(){ this.ref.close(this.text.trim()); }
  cancel(){ this.ref.close(); }
}
