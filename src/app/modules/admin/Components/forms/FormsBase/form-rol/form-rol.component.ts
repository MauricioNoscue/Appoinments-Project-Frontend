import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolC } from '../../../../../../shared/Models/security/RolModel';

@Component({
  selector: 'app-form-rol',
standalone:false,

  templateUrl: './form-rol.component.html',
  styleUrl: './form-rol.component.css'
})
export class FormRolComponent implements OnInit {

    @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?:RolC;
  @Output() formSubmit = new EventEmitter<RolC>();

  rolForm: FormGroup;
  permisosList: string[] = [
    'Leer',
    'Escribir',
    'Editar',
    'Eliminar',
    'Administrar usuarios',
    'Gestionar roles'
  ];

  constructor(private fb: FormBuilder) {
    this.rolForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.data && this.modo === 'edit') {
      this.rolForm.patchValue({
        id:this.data?.id,
        nombre: this.data.nombre,
        descripcion: this.data.descripcion
      });

      this.data.permisos.forEach(p => {
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
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get permisosFormArray(): FormArray {
    return this.rolForm.get('permisos') as FormArray;
  }

  onPermisoChange(permiso: string, event: any): void {
    const permisosArray = this.permisosFormArray;
    if (event.target.checked) {
      if (!permisosArray.value.includes(permiso)) {
        permisosArray.push(this.fb.control(permiso));
      }
    } else {
      const index = permisosArray.controls.findIndex(x => x.value === permiso);
      if (index >= 0) {
        permisosArray.removeAt(index);
      }
    }
  }

  isPermisoSelected(permiso: string): boolean {
    return this.permisosFormArray.value.includes(permiso);
  }

  onSubmit(): void {
    if (this.rolForm.valid) {
      this.formSubmit.emit(this.rolForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.rolForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.rolForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
