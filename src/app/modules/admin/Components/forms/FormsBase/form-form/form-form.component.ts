import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  Optional,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { FormC } from '../../../../../../shared/Models/security/FormModel';

@Component({
  selector: 'app-form-form',
  standalone: true, // 👈 IMPORTANTE para abrir directo con MatDialog
  templateUrl: './form-form.component.html',
  styleUrls: ['./form-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class FormFormComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: FormC;
  @Output() formSubmit = new EventEmitter<FormC>();

  formForm: FormGroup;

  constructor(
    private fb: FormBuilder,

    // Compatibilidad con tu contenedor genérico (si en algún lado lo usas)
    @Optional()
    @Inject('MODAL_DATA')
    private modalData?: { modo: 'create' | 'edit'; data?: FormC },

    // Flujo recomendado: abrir directo con MatDialog.open(...)
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    private dialogData?: { modo?: 'create' | 'edit'; data?: FormC },

    @Optional() private dialogRef?: MatDialogRef<FormFormComponent>
  ) {
    this.formForm = this.createForm();
  }

  ngOnInit(): void {
    // fuente de verdad para modo + data (admite ambos flujos)
    const modoIn = this.modalData?.modo ?? this.dialogData?.modo ?? this.modo;
    const dataIn = this.modalData?.data ?? this.dialogData?.data ?? this.data;

    this.modo = modoIn;
    if (modoIn === 'edit' && dataIn) {
      this.formForm.patchValue(dataIn);
    }

    // Sanitiza 'name'
    this.formForm.get('name')?.valueChanges.subscribe((v: string) => {
      const raw = v || '';
      const clean = raw.replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]/g, '');
      if (raw !== clean) {
        this.formForm.get('name')?.setValue(clean, { emitEvent: false });
      }
    });

    // Sanitiza 'url' (sin espacios y trim)
    this.formForm.get('url')?.valueChanges.subscribe((v: string) => {
      const raw = v ?? '';
      const noSpaces = raw.replace(/\s+/g, '');
      const cleaned = noSpaces.trim();
      if (raw !== cleaned) {
        this.formForm.get('url')?.setValue(cleaned, { emitEvent: false });
      }
    });
  }

  // ✅ Validador de URL (http/https + sintaxis correcta)


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
      url: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    if (this.formForm.invalid) {
      this.formForm.markAllAsTouched();
      return;
    }

    const id =
      this.modalData?.data?.id ?? this.dialogData?.data?.id ?? this.data?.id;
    const payload: FormC =
      this.modo === 'edit' && id
        ? { id, ...this.formForm.value }
        : { ...this.formForm.value };

    // si está dentro de MatDialog, cerramos devolviendo el payload
    if (this.dialogRef) this.dialogRef.close(payload);

    // y emitimos también por si alguien lo usa fuera del diálogo
    this.formSubmit.emit(payload);
  }

  cancelar(): void {
    if (this.dialogRef) this.dialogRef.close(null);
  }

  getFieldError(fieldName: string): string {
    const field = this.formForm.get(fieldName);
    if (field?.errors && (field.touched || field.dirty)) {
      if (fieldName === 'name') {
        if (field.errors['required']) return 'El nombre es obligatorio';
        if (field.errors['minlength']) return 'El nombre es muy corto';
        if (field.errors['maxlength']) return 'El nombre es muy largo';
        if (field.errors['pattern'])
          return 'Solo se permiten letras y espacios';
      }

      if (fieldName === 'url') {
        if (field.errors['required']) return 'La URL es obligatoria';
        if (field.errors['urlProtocol'])
          return 'La URL debe iniciar con http:// o https://';
        if (field.errors['urlNoSpaces'])
          return 'La URL no debe contener espacios';
        if (field.errors['urlInvalid']) return 'La URL no es válida';
      }

      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength'])
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
