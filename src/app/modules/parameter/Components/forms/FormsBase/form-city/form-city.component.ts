import {Component,OnInit,Input,Output,EventEmitter,Inject,} from '@angular/core';
import {FormGroup,FormBuilder,Validators,ReactiveFormsModule,FormsModule,} from '@angular/forms';
import {City,CityCreate,CityEdit,CityList,} from '../../../../../../shared/Models/parameter/CityModel';
import { DepartamentService } from '../../../../../../shared/services/departament.service';
import {DepartamentList,DepartamentOption,} from '../../../../../../shared/Models/parameter/Departament';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-city',
  standalone: true,
  templateUrl: './form-city.component.html',
  styleUrls: ['./form-city.component.css'],
  imports: [CommonModule,MatFormFieldModule,MatSelectModule,MatOptionModule,MatInputModule,ReactiveFormsModule,FormsModule],
})
export class FormCityComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: City;
  @Output() formSubmit = new EventEmitter<CityCreate | CityEdit>();

  cityForm: FormGroup;
  departamentsm: DepartamentOption[] = [];

  constructor(
    private fb: FormBuilder,
    private departamentService: DepartamentService,
    @Inject('MODAL_DATA')
    private modalData: { modo: 'create' | 'edit'; data?: City }
  ) {
    this.cityForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('Modal Data:', this.modalData);
    this.cargarDepartamentos();
    if (this.modalData.modo === 'edit' && this.modalData.data) {
      this.cityForm.patchValue(this.modalData.data);
    }
  }

  private cargarDepartamentos(): void {
    this.departamentService.traerTodo().subscribe({
      next: (data: DepartamentOption[]) => {
        this.departamentsm = data.map((dept) => ({
          id: dept.id,
          name: dept.name,
        }));
        console.log('Departamentos cargados:', this.departamentsm);
      },
      error: (err) => {
        console.error(
          'Error al cargar ciudades para extraer departamentos:',
          err
        );
      },
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      departamentId: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.cityForm.valid) {
      let payload: CityCreate | CityEdit;

      if (this.modalData.modo === 'edit' && this.modalData.data?.id) {
        payload = {
          id: this.modalData.data.id,
          ...this.cityForm.value,
        } as CityEdit;
      } else {
        payload = {
          ...this.cityForm.value,
        } as CityCreate;
      }

      console.log('Payload a enviar:', payload);
      this.formSubmit.emit(payload);
    } else {
      Object.values(this.cityForm.controls).forEach((control) =>
        control.markAsTouched()
      );
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.cityForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength'])
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
