import {
  Component,
  OnInit,
  Optional,
  Inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import {
  City,
  CityCreate,
  CityEdit,
} from '../../../../../../shared/Models/parameter/CityModel';
import { DepartamentService } from '../../../../../../shared/services/departament.service';
import { DepartamentOption } from '../../../../../../shared/Models/parameter/Departament';

@Component({
  selector: 'app-form-city',
  standalone: true,
  templateUrl: './form-city.component.html',
  styleUrls: ['./form-city.component.css'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule, // necesario para mat-dialog-*
  ],
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

    // Soporte a contenedor antiguo si lo usas en otro flujo (opcional):
    @Optional()
    @Inject('MODAL_DATA')
    private modalData?: { modo: 'create' | 'edit'; data?: City },

    // Datos cuando abrimos directo con MatDialog (recomendado):
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    private dialogData?: { modo?: 'create' | 'edit'; data?: City },

    @Optional() private dialogRef?: MatDialogRef<FormCityComponent>
  ) {
    this.cityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      departamentId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarDepartamentos();

    const modoIn = this.modalData?.modo ?? this.dialogData?.modo ?? this.modo;
    const dataIn = this.modalData?.data ?? this.dialogData?.data ?? this.data;

    this.modo = modoIn;
    if (modoIn === 'edit' && dataIn) {
      this.cityForm.patchValue(dataIn);
    }
  }

  private cargarDepartamentos(): void {
    this.departamentService.traerTodo().subscribe({
      next: (data: DepartamentOption[]) => {
        this.departamentsm = data.map((d) => ({ id: d.id, name: d.name }));
      },
      error: (err) => console.error('Error al cargar departamentos:', err),
    });
  }

  onSubmit(): void {
    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
      return;
    }

    const id = this.modalData?.data?.id ?? this.dialogData?.data?.id;
    const payload: CityCreate | CityEdit =
      this.modo === 'edit' && id
        ? ({ id, ...this.cityForm.value } as CityEdit)
        : ({ ...this.cityForm.value } as CityCreate);

    // Si estamos en un MatDialog, cerramos retornando el payload
    if (this.dialogRef) this.dialogRef.close(payload);

    // Además emitimos por si reúsas el form fuera del diálogo
    this.formSubmit.emit(payload);
  }

  cancelar(): void {
    if (this.dialogRef) this.dialogRef.close(null);
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
