import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Optional,
  Inject,
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
  Institution,
  InstitutionCreate,
  InstitutionUpdate,
} from '../../../../../../shared/Models/parameter/InstitutionModel';
import {
  CityList,
  CityOption,
} from '../../../../../../shared/Models/parameter/CityModel';
import { CityService } from '../../../../../../shared/services/city.service';

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
    MatDialogModule, // <-- necesario para mat-dialog-*
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

    // Contenedor genérico (opcional):
    @Optional()
    @Inject('MODAL_DATA')
    private modalData?: { modo: 'create' | 'edit'; data?: Institution },

    // Apertura directa con MatDialog (recomendado):
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    private dialogData?: { modo?: 'create' | 'edit'; data?: Institution },

    @Optional() private dialogRef?: MatDialogRef<FormInstitutionComponent>
  ) {
    this.institutionForm = this.createForm();
  }

  ngOnInit(): void {
    this.cargarCiudades();

    const modoIn = this.modalData?.modo ?? this.dialogData?.modo ?? this.modo;
    const dataIn = this.modalData?.data ?? this.dialogData?.data ?? this.data;

    this.modo = modoIn;
    if (modoIn === 'edit' && dataIn) {
      this.institutionForm.patchValue(dataIn);
    }
  }

  private cargarCiudades(): void {
    this.cityService.traerTodo().subscribe({
      next: (data: CityList[]) => {
        this.citys = data.map((cy) => ({ id: cy.id, name: cy.name }));
      },
      error: (err) => console.error('Error al cargar ciudades:', err),
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
    if (this.institutionForm.invalid) {
      this.institutionForm.markAllAsTouched();
      return;
    }

    const id = this.modalData?.data?.id ?? this.dialogData?.data?.id;
    const payload: InstitutionCreate | InstitutionUpdate =
      this.modo === 'edit' && id
        ? ({ id, ...this.institutionForm.value } as InstitutionUpdate)
        : ({ ...this.institutionForm.value } as InstitutionCreate);

    if (this.dialogRef) this.dialogRef.close(payload); // cerrar si estamos en MatDialog
    this.formSubmit.emit(payload); // emitir por si se usa fuera del diálogo
  }

  cancelar(): void {
    if (this.dialogRef) this.dialogRef.close(null);
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
