import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DoctorService } from '../../../../../../shared/services/doctor.service';

export interface CreateDoctorDTO {
  specialty: string;
  personId: number;
  active: boolean;
  image: string;
  emailDoctor: string;
}

@Component({
  selector: 'app-doctor-form-dialog',
  templateUrl: './doctor-form-dialog.component.html',
  styleUrls: ['./doctor-form-dialog.component.css'],
  standalone: false
})
export class DoctorFormDialogComponent {
  saving = false;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private ref: MatDialogRef<DoctorFormDialogComponent>,
    private doctorService: DoctorService,
    @Inject(MAT_DIALOG_DATA) public data: { specialties: string[] }
  ) {
    this.form = this.fb.group({
      specialty: ['', Validators.required],
      personId: [null, [Validators.required]],
      active: [true],
      image: [''],
      emailDoctor: ['', [Validators.required, Validators.email]],
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload = this.form.value as unknown as CreateDoctorDTO;
    this.saving = true;

    this.doctorService.crear(payload).subscribe({
      next: () => {
        this.saving = false;
        this.snack.open('Médico creado', 'OK', { duration: 2000 });
        this.ref.close(true);
      },
      error: (err) => {
        this.saving = false;
        console.error(err);
        this.snack.open('Error al crear el médico', 'Cerrar', { duration: 3000 });
      },
    });
  }

  cancel(): void {
    this.ref.close(false);
  }
}