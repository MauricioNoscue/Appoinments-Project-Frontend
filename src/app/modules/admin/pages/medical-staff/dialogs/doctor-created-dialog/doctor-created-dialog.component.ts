import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DoctorList } from '../../../../../../shared/Models/hospital/DoctorListModel';

@Component({
  selector: 'app-doctor-created-dialog',
  standalone: false,
  templateUrl: './doctor-created-dialog.component.html',
  styleUrl: './doctor-created-dialog.component.css'
})
export class DoctorCreatedDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DoctorCreatedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { doctor: DoctorList }
  ) {}

  onContinue(): void {
    this.dialogRef.close();
  }
}
