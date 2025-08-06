import { Component, OnInit, Input, Output, EventEmitter, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormC } from "../../../../../../shared/Models/security/FormModel";
import { MaterialModule } from "../../../../../../shared/material.module";

@Component({
  selector: 'app-form-form',
  templateUrl: './form-form.component.html',
  styleUrls: ['./form-form.component.css'],
  imports: [MaterialModule]
})
export class FormFormComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: FormC;
  @Output() formSubmit = new EventEmitter<FormC>();

  formForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject('MODAL_DATA') private modalData: {modo: 'create' | 'edit', data?: FormC}
  ){
    this.formForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('Modal Data:', this.modalData);
    if (this.modalData.modo === 'edit' && this.modalData.data) {
      this.formForm.patchValue(this.modalData.data);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      url: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
  if (this.formForm.valid) {
    const payload: FormC = {
      ...this.formForm.value,
      ...(this.modalData.modo === 'edit' && this.modalData.data?.id ? { id: this.modalData.data.id } : {})
    };
    this.formSubmit.emit(payload);
  } else {
    Object.values(this.formForm.controls).forEach(control => control.markAsTouched());
  }
}


  getFieldError(fieldName: string): string {
    const field = this.formForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}