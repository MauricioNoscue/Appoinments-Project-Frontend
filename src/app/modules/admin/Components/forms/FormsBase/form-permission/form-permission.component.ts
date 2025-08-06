import { Component, EventEmitter, Input, Output, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PermissionC} from '../../../../../../shared/Models/security/permission';

@Component({
  selector: 'app-form-permission',
  standalone: false,
  templateUrl: './form-permission.component.html',
  styleUrl: './form-permission.component.css',
})
export class FormPermissionComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: PermissionC;
  @Output() formSubmit = new EventEmitter<PermissionC>();

  permissionForm: FormGroup;
  // permisosList: string[] = [
  //   'Leer',
  //   'Escribir',
  //   'Editar',
  //   'Eliminar',
  //   'Administrar usuarios',
  //   'Gestionar roles',
  // ];

  constructor(
    private fb: FormBuilder,
    @Inject('MODAL_DATA')
    private modalData: { modo: 'create' | 'edit'; data?: PermissionC }
  ) {
    this.permissionForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('Modal Data:', this.modalData);
    if (this.modalData.modo === 'edit' && this.modalData.data) {
      this.permissionForm.patchValue(this.modalData.data );
    }
  }



  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    console.log('Submit intentado:', this.permissionForm.value);
    console.log('Es válido:', this.permissionForm.valid);
    if (this.permissionForm.valid) {
      const payload: PermissionC = {
        ...this.permissionForm.value,
        ...(this.modalData.modo === 'edit' && this.modalData.data?.id
          ? { id: this.modalData.data.id }
          : {}),
      };
      this.formSubmit.emit(payload);
    } else {
      Object.values(this.permissionForm.controls).forEach((control) =>
        control.markAsTouched()
      );
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.permissionForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength'])
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
