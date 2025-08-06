
import {Component,OnInit,Input,Output,EventEmitter,Inject,} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import {BranchCreated,BranchEdit,Branch,} from '../../../../../../shared/Models/parameter/Branch';
import { MaterialModule } from '../../../../../../shared/material.module';
import { Branch, BranchCreated, BranchEdit } from '../../../../../../shared/Models/parameter/Branch';

@Component({
  selector: 'app-form-branch',
  standalone: true,
  templateUrl: './form-branch.component.html',
  styleUrls: ['./form-branch.component.css'],
  imports: [MaterialModule],
})
export class FormBranchComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: Branch;
  @Output() formSubmit = new EventEmitter<BranchCreated | BranchEdit>();

  branchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject('MODAL_DATA')
    private modalData: { modo: 'create' | 'edit'; data?: Branch }
  ) {
    this.branchForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('Modal Data:', this.modalData);
    if (this.modalData.modo === 'edit' && this.modalData.data) {
      this.branchForm.patchValue(this.modalData.data);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      institutionId: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.branchForm.valid) {
      let payload: BranchCreated | BranchEdit;

      if (this.modalData.modo === 'edit' && this.modalData.data?.id) {
        payload = {
          id: this.modalData.data.id,
          ...this.branchForm.value,
        } as BranchEdit;
      } else {
        payload = {
          ...this.branchForm.value,
        } as BranchCreated;
      }

      this.formSubmit.emit(payload);
    } else {
      Object.values(this.branchForm.controls).forEach((control) =>
        control.markAsTouched()
      );
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.branchForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength'])
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['email']) return `El correo no es válido`;
    }
    return '';
  }
}
