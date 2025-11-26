import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TypeCitationsService } from '../../../../services/type-citations.service';

@Component({
  selector: 'app-type-citation-modal',
  templateUrl: './type-citation-modal.component.html',
  styleUrl: './type-citation-modal.component.css',
  standalone: false
})
export class TypeCitationModalComponent {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TypeCitationModalComponent>,
    private srv: TypeCitationsService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      icon: ['optometria.png']
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.srv.crear(this.form.value).subscribe({
      next: () => {
        Swal.fire('Creado', 'Tipo de cita creado correctamente', 'success');
        this.dialogRef.close(true);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear el tipo de cita', 'error');
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }}