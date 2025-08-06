import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PermissionC} from '../../../../../../shared/Models/security/permission';

@Component({
  selector: 'app-form-permission',
  standalone: false,
  templateUrl: './form-permission.component.html',
  styleUrl: './form-permission.component.css',
})
export class FormPermissionComponent {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: PermissionC;
  @Output() formSubmit = new EventEmitter<PermissionC>();

  permissionForm: FormGroup;
  permisosList: string[] = [
    'Leer',
    'Escribir',
    'Editar',
    'Eliminar',
    'Administrar usuarios',
    'Gestionar roles',
  ];
  constructor(private fb: FormBuilder) {
    this.permissionForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.data && this.modo === 'edit') {
      this.permissionForm.patchValue({
        id: this.data?.id,
        name: this.data.name,
        description: this.data.description,
      });

      this.data.permisos?.forEach((p) => {
        if (!this.permisosFormArray.value.includes(p)) {
          this.permisosFormArray.push(this.fb.control(p));
        }
      });
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      permisos: this.fb.array([]),
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get permisosFormArray(): FormArray {
    return this.permissionForm.get('permisos') as FormArray;
  }

  onPermisoChange(permiso: string, event: any): void {
    const permisosArray = this.permisosFormArray;
    if (event.target.checked) {
      if (!permisosArray.value.includes(permiso)) {
        permisosArray.push(this.fb.control(permiso));
      }
    } else {
      const index = permisosArray.controls.findIndex(
        (x) => x.value === permiso
      );
      if (index !== 0) {
        permisosArray.removeAt(index);
      }
    }
  }

  isPermisoSelected(permiso: string): boolean {
    return this.permisosFormArray.value.includes(permiso);
  }

  onSubmit(): void {
    if (this.permissionForm.valid) {
      this.formSubmit.emit(this.permissionForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.permissionForm.controls).forEach((control) => {
      control.markAsTouched();
    });
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
