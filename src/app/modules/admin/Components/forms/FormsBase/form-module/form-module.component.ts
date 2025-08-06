import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModuleCreated, ModuleEdid } from '../../../../../../shared/Models/security/moduleModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-module',
standalone:false,
  templateUrl: './form-module.component.html',
  styleUrl: './form-module.component.css'
})
export class FormModuleComponent implements OnInit {


  
 @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?:ModuleEdid;
  @Output() formSubmit = new EventEmitter<ModuleCreated |ModuleEdid>();

  rolForm: FormGroup;

constructor(private fb: FormBuilder) {
    this.rolForm = this.createForm();
  }


    ngOnInit(): void {
    if (this.data && this.modo === 'edit') {
      this.rolForm.patchValue({
        id:this.data?.id,
        name: this.data.Name,
        description: this.data.Description
      });

    
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
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
