import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  Inject,
  Optional,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PermissionC } from '../../../../../../shared/Models/security/permission';

@Component({
  selector: 'app-form-permission',
  standalone: true,
  templateUrl: './form-permission.component.html',
  styleUrls: ['./form-permission.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class FormPermissionComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: PermissionC;
  @Output() formSubmit = new EventEmitter<PermissionC>();

  permissionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Optional()
    @Inject('MODAL_DATA')
    private modalData?: { modo: 'create' | 'edit'; data?: PermissionC },
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    private dialogData?: { modo?: 'create' | 'edit'; data?: PermissionC },
    @Optional() private dialogRef?: MatDialogRef<FormPermissionComponent>
  ) {
    this.permissionForm = this.fb.group({
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
          Validators.maxLength(300),
        ],
      ],
    });
  }

  ngOnInit(): void {
    const modoIn = this.modalData?.modo ?? this.dialogData?.modo ?? this.modo;
    const dataIn = this.modalData?.data ?? this.dialogData?.data ?? this.data;

    this.modo = modoIn;
    if (modoIn === 'edit' && dataIn) {
      this.permissionForm.patchValue(dataIn);
    }

    // Sanitiza name (solo letras/espacios, colapsa espacios)
    this.permissionForm.get('name')?.valueChanges.subscribe((v: string) => {
      const raw = v || '';
      const only = raw.replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ' -]/g, '');
      const cleaned = only.replace(/\s+/g, ' ').trim();
      if (raw !== cleaned) {
        this.permissionForm
          .get('name')
          ?.setValue(cleaned, { emitEvent: false });
      }
    });
  }

  onSubmit(): void {
    if (this.permissionForm.invalid) {
      this.permissionForm.markAllAsTouched();
      return;
    }

    const payload: PermissionC = {
      ...this.permissionForm.value,
      ...(this.modo === 'edit'
        ? {
            id:
              this.modalData?.data?.id ??
              this.dialogData?.data?.id ??
              this.data?.id,
          }
        : {}),
    };

    if (this.dialogRef) this.dialogRef.close(payload);
    this.formSubmit.emit(payload);
  }

  cancelar(): void {
    if (this.dialogRef) this.dialogRef.close(null);
  }

  getFieldError(fieldName: string): string {
    const field = this.permissionForm.get(fieldName);
    if (field?.errors && (field.touched || field.dirty)) {
      if (field.errors['required']) return 'Este campo es obligatorio';
      if (field.errors['minlength'])
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength'])
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (fieldName === 'name' && field.errors['pattern'])
        return 'Solo letras, espacios, guion (-) y apóstrofo (’)';
    }
    return '';
  }
}
