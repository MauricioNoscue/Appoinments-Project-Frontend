import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Optional,
  Inject,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../../shared/material.module';
import {
  Departament,
  DepartamentEdit,
  DepartamentCreated,
} from '../../../../../../shared/Models/parameter/Departament';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-form-departament',
  standalone: true,
  templateUrl: './form-departament.component.html',
  styleUrls: ['./form-departament.component.css'],
  imports: [MaterialModule, MatDialogModule], // <- agrega MatDialogModule
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

    // Flujo con contenedor genérico (opcional):
    @Optional()
    @Inject('MODAL_DATA')
    private modalData?: { modo: 'create' | 'edit'; data?: Departament },

    // Flujo directo con MatDialog (recomendado):
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    private dialogData?: { modo?: 'create' | 'edit'; data?: Departament },

    @Optional() private dialogRef?: MatDialogRef<FormDepartamentComponent>
  ) {
    this.departamentForm = this.createForm();
  }

  ngOnInit(): void {
    const modoIn = this.modalData?.modo ?? this.dialogData?.modo ?? this.modo;
    const dataIn = this.modalData?.data ?? this.dialogData?.data ?? this.data;

    this.modo = modoIn;
    if (modoIn === 'edit' && dataIn) {
      this.departamentForm.patchValue(dataIn);
    }
      this.departamentForm.get('name')?.valueChanges.subscribe((v: string) => {
        const raw = v || '';
        const clean = raw.replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]/g, ''); // quita todo lo que no sea letra/espacio
        if (raw !== clean) {
          this.departamentForm
            .get('name')
            ?.setValue(clean, { emitEvent: false });
        }
      });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.departamentForm.invalid) {
      this.departamentForm.markAllAsTouched();
      return;
    }

    const id = this.modalData?.data?.id ?? this.dialogData?.data?.id;
    const payload: DepartamentCreated | DepartamentEdit =
      this.modo === 'edit' && id
        ? ({ id, ...this.departamentForm.value } as DepartamentEdit)
        : ({ ...this.departamentForm.value } as DepartamentCreated);

    // Si está en MatDialog, cerrar devolviendo datos:
    if (this.dialogRef) this.dialogRef.close(payload);

    // También emitir por si se usa fuera de dialog:
    this.formSubmit.emit(payload);
  }

  cancelar(): void {
    if (this.dialogRef) this.dialogRef.close(null);
  }

  getFieldError(fieldName: string): string {
    const field = this.departamentForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (fieldName === 'name') {
        if (field.errors?.['required']) return 'El nombre es obligatorio';
        if (field.errors?.['minlength']) return 'El nombre es muy corto';
        if (field.errors?.['maxlength']) return 'El nombre es muy largo';
        if (field.errors?.['pattern'])
          return 'Solo se permiten letras y espacios';
      }
      if (field.errors['minlength'])
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
