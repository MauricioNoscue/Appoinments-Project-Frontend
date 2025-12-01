import { Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-request-doctor-create',
  standalone: false,
  templateUrl: './request-doctor-create.component.html',
  styleUrl: './request-doctor-create.component.css'
})
export class RequestDoctorCreateComponent {

  // ⚡ Declarar sin inicializar
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RequestDoctorCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {
    // ⚡ Ahora sí crear el formulario aquí
    this.form = this.fb.group({
      reason: ['', Validators.required],
      typeRequest: [0, Validators.required],       // 0 = AccountUnlock
      userId: [data.userId, Validators.required],  // asignado correctamente
      startDate: [null],
      endDate: [null],
      statustypesId: [7],                           // fijo por defecto
      observation: ['']                       // oculto en UI
    });
  }

  // ✔️ Guardar
  submit(): void {
    if (this.form.invalid) return;

    this.dialogRef.close(this.form.value); // ← envía DTO al padre
  }

  close(): void {
    this.dialogRef.close(null);
  }
}
