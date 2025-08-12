
import {Component,OnInit,Input,Output,EventEmitter,Inject,} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Branch, BranchCreated, BranchEdit } from '../../../../../../shared/Models/parameter/Branch';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { InstitutionList, InstitutionOption } from '../../../../../../shared/Models/parameter/InstitutionModel';
import { InstitutionService } from '../../../../../../shared/services/institution.service';

@Component({
  selector: 'app-form-branch',
  standalone: true,
  templateUrl: './form-branch.component.html',
  styleUrls: ['./form-branch.component.css'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class FormBranchComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: Branch;
  @Output() formSubmit = new EventEmitter<BranchCreated | BranchEdit>();

  branchForm: FormGroup;
  institucions: InstitutionOption [] = [];

  constructor(
    private fb: FormBuilder,
    private institutionService: InstitutionService,
    @Inject('MODAL_DATA')
    private modalData: { modo: 'create' | 'edit'; data?: Branch }
  ) {
    this.branchForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('Modal Data:', this.modalData);
    this.cargarInstituciones();
    if (this.modalData.modo === 'edit' && this.modalData.data) {
      this.branchForm.patchValue(this.modalData.data);
    }
  }


private cargarInstituciones(): void {
    this.institutionService.traerTodo().subscribe({
      next: (data: InstitutionList[]) => {
        this.institucions = data.map((inst) => ({
          id: inst.id,
          name: inst.name,
        }));
        console.log('Instituciones cargadas:', this.institucions);
      },
      error: (err) => {
        console.error(
          'Error al cargar instituciones para extraer instituciones:',
          err
        );
      },
    });
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
