
import {Component,OnInit,Input,Output,EventEmitter,Inject,} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../../shared/material.module';
import {Departament,DepartamentEdit,DepartamentCreated,} from '../../../../../../shared/Models/parameter/Departament';

@Component({
  selector: 'app-form-departament',
  standalone: true,
  templateUrl: './form-departament.component.html',
  styleUrls: ['./form-departament.component.css'],
  imports: [MaterialModule],
})
export class FormDepartamentComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: Departament;
  @Output() formSubmit = new EventEmitter<
    DepartamentCreated | DepartamentEdit
  >();

  departamentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject('MODAL_DATA')
    private modalData: { modo: 'create' | 'edit'; data?: Departament }
  ) {
    this.departamentForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.modalData.modo === 'edit' && this.modalData.data) {
      this.departamentForm.patchValue(this.modalData.data);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  onSubmit(): void {
    if (this.departamentForm.valid) {
      let payload: DepartamentCreated | DepartamentEdit;

      if (this.modalData.modo === 'edit' && this.modalData.data?.id) {
        payload = {
          id: this.modalData.data.id,
          ...this.departamentForm.value,
        } as DepartamentEdit;
      } else {
        payload = {
          ...this.departamentForm.value,
        } as DepartamentCreated;
      }

      this.formSubmit.emit(payload);
    } else {
      Object.values(this.departamentForm.controls).forEach((control) =>
        control.markAsTouched()
      );
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.departamentForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength'])
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
