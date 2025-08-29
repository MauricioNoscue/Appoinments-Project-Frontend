import { Component, OnInit, Optional, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

// Material
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RolCreated, RolUpdated } from '../../../../../../shared/Models/security/RolModel';

@Component({
  selector: 'app-form-rol',
  standalone: true,
  templateUrl: './form-rol.component.html',
  styleUrls: ['./form-rol.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class FormRolComponent implements OnInit {
  modo: 'create' | 'edit' = 'create';
  rolForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    private dialogData?: { modo?: 'create' | 'edit'; data?: RolUpdated | any },
    @Optional() private dialogRef?: MatDialogRef<FormRolComponent>
  ) {
    this.rolForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ' -]+$/),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.modo = this.dialogData?.modo ?? 'create';
    const d = this.dialogData?.data;

    if (this.modo === 'edit' && d) {
      this.rolForm.patchValue({
        name: d.name ?? d.Name ?? '',
        description: d.description ?? d.Description ?? '',
      });
    }

    // saneos
    this.rolForm.get('name')?.valueChanges.subscribe((v) => {
      const raw = v ?? '';
      const only = raw.replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ' -]/g, '');
      const cleaned = only.replace(/\s+/g, ' ').trim();
      if (raw !== cleaned)
        this.rolForm.get('name')?.setValue(cleaned, { emitEvent: false });
    });

    this.rolForm.get('description')?.valueChanges.subscribe((v) => {
      const raw = v ?? '';
      const cleaned = raw.replace(/\s+/g, ' ').trim();
      if (raw !== cleaned)
        this.rolForm
          .get('description')
          ?.setValue(cleaned, { emitEvent: false });
    });
  }

  onSubmit(): void {
    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      return;
    }

    const id = this.dialogData?.data?.id;
    const payload: RolCreated | RolUpdated =
      this.modo === 'edit' && id
        ? ({ id, ...this.rolForm.value } as RolUpdated)
        : ({ ...this.rolForm.value } as RolCreated);

    this.dialogRef?.close(payload);
  }

  cancelar(): void {
    this.dialogRef?.close(null);
  }

  getFieldError(field: 'name' | 'description'): string {
    const c = this.rolForm.get(field);
    if (!c || !(c.touched || c.dirty) || !c.errors) return '';
    if (c.errors['required']) return 'Este campo es obligatorio';
    if (c.errors['minlength'])
      return `Mínimo ${c.errors['minlength'].requiredLength} caracteres`;
    if (c.errors['maxlength'])
      return `Máximo ${c.errors['maxlength'].requiredLength} caracteres`;
    if (c.errors['pattern'])
      return 'Solo letras, espacios, guion (-) y apóstrofo (’)';
    return 'Valor inválido';
  }
}
