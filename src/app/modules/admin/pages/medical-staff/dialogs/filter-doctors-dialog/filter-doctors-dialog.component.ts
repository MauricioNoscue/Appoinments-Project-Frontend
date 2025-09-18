import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Specialty } from '../../../../../../shared/Models/hospital/SpecialtyModel';

interface Data { specialties: Specialty[]; selected: string | null; }

@Component({
  selector: 'app-filter-doctors-dialog',
  templateUrl: './filter-doctors-dialog.component.html',
  styleUrls: ['./filter-doctors-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatOptionModule
  ]
})
export class FilterDoctorsDialogComponent {
  form!: FormGroup;
  

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private ref: MatDialogRef<FilterDoctorsDialogComponent>
  ) {
    this.form = this.fb.group({
      specialty: [this.data.selected ?? null]
    });
  }

  clear(): void {
    this.form.patchValue({ specialty: null });
  }

  apply(): void {
    this.ref.close({ specialty: this.form.value.specialty ?? null });
  }
}