import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../../../../shared/material.module';

type Relation =
  | 'Papá'
  | 'Mamá'
  | 'Hijo'
  | 'Hija'
  | 'Hermano'
  | 'Hermana'
  | 'Tío'
  | 'Tía'
  | 'Sobrino'
  | 'Sobrina'
  | 'Abuelo'
  | 'Abuela'
  | 'Otro';

export interface PersonFormValue {
  id?: number | null;
  name: string; // FirstName
  lastname: string; // LastName
  relation: Relation | string;
  documentTypeId: number; // requerido
  idNumero: string; // Document
  color: string; // solo UI
}

type DialogData =
  | { mode: 'create' }
  | { mode: 'edit'; person: PersonFormValue };

@Component({
  selector: 'app-form-relacion-persona',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MaterialModule,
  ],
  templateUrl: './form-relacion-persona.component.html',
  styleUrl: './form-relacion-persona.component.css',
})
export class FormRelacionPersonaComponent {
  private fb = inject(FormBuilder);

  mode: 'create' | 'edit' = 'create';

  form: FormGroup = this.fb.group({
    id: new FormControl<number | null>(null),

    // Nombre: solo letras y espacios
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/), // 👈 solo texto
      ],
    }),

    // Apellido: solo letras y espacios
    lastname: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/), // 👈 solo texto
      ],
    }),

    relation: new FormControl<Relation | string>('Otro', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    documentTypeId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),

    // Documento: solo números
    idNumero: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^[0-9]+$/), // 👈 solo dígitos
      ],
    }),


  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private ref: MatDialogRef<FormRelacionPersonaComponent>
  ) {
    this.mode = data.mode;
    if (data.mode === 'edit') this.form.patchValue(data.person);
  }

  save() {
    if (this.form.invalid) return;
    this.ref.close(this.form.getRawValue() as PersonFormValue);
  }
  cancel() {
    this.ref.close(null);
  }
}
