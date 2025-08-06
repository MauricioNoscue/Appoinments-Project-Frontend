import { Component, OnInit, Input, Output, EventEmitter, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { City, CityCreate, CityEdit } from "../../../../../../shared/Models/parameter/CityModel";
import { MaterialModule } from "../../../../../../shared/material.module";

@Component({
  selector: 'app-form-city',
  standalone: true,
  templateUrl: './form-city.component.html',
  styleUrls: ['./form-city.component.css'],
  imports: [MaterialModule]
})
export class FormCityComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: City;
  @Output() formSubmit = new EventEmitter<CityCreate | CityEdit>();

  cityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject('MODAL_DATA') private modalData: {modo: 'create' | 'edit', data?: City}
  ){
    this.cityForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('Modal Data:', this.modalData);
    if (this.modalData.modo === 'edit' && this.modalData.data) {
      this.cityForm.patchValue(this.modalData.data);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      departamentId: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.cityForm.valid) {
      let payload: CityCreate | CityEdit;
      
      if (this.modalData.modo === 'edit' && this.modalData.data?.id) {
        payload = {
          id: this.modalData.data.id,
          ...this.cityForm.value
        } as CityEdit;
      } else {
        payload = {
          ...this.cityForm.value
        } as CityCreate;
      }
      
      this.formSubmit.emit(payload);
    } else {
      Object.values(this.cityForm.controls).forEach(control => control.markAsTouched());
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.cityForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
