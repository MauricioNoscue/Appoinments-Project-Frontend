import { Component, OnInit, Input, Output, EventEmitter, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Institution, InstitutionCreate, InstitutionUpdate } from "../../../../../../shared/Models/parameter/InstitutionModel";
import { MaterialModule } from "../../../../../../shared/material.module";
import { CityCreate, CityList, CityOption } from "../../../../../../shared/Models/parameter/CityModel";
import { CityService } from "../../../../../../shared/services/city.service";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-form-institution',
  standalone: true,
  templateUrl: './form-institution.component.html',
  styleUrls: ['./form-institution.component.css'],
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
export class FormInstitutionComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: Institution;
  @Output() formSubmit = new EventEmitter<
    InstitutionCreate | InstitutionUpdate
  >();

  institutionForm: FormGroup;
  citys: CityOption[] = [];

  constructor(
    private fb: FormBuilder,
    private cityService: CityService,
    @Inject('MODAL_DATA')
    private modalData: { modo: 'create' | 'edit'; data?: Institution }
  ) {
    this.institutionForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('Modal Data:', this.modalData);
    this.cargarCiudades();
    if (this.modalData.modo === 'edit' && this.modalData.data) {
      this.institutionForm.patchValue(this.modalData.data);
    }
  }
  private cargarCiudades(): void {
    this.cityService.traerTodo().subscribe({
      next: (data: CityList[]) => {
        this.citys = data.map((cy) => ({
          id: cy.id,
          name: cy.name,
        }));
        console.log('Ciudades cargadas:', this.citys);
      },
      error: (err) => {
        console.error('Error al cargar ciudades:', err);
      },
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      nit: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      cityId: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.institutionForm.valid) {
      let payload: InstitutionCreate | InstitutionUpdate;

      if (this.modalData.modo === 'edit' && this.modalData.data?.id) {
        payload = {
          id: this.modalData.data.id,
          ...this.institutionForm.value,
        } as InstitutionUpdate;
      } else {
        payload = {
          ...this.institutionForm.value,
        } as InstitutionCreate;
      }

      this.formSubmit.emit(payload);
    } else {
      Object.values(this.institutionForm.controls).forEach((control) =>
        control.markAsTouched()
      );
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.institutionForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength'])
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['email']) return `${fieldName} debe ser un email válido`;
    }
    return '';
  }
}
