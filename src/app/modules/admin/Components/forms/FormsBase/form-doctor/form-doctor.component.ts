import { Component, EventEmitter, Input, OnInit, Output, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Interfaces
export interface PersonaCreacion {
  fullName: string;
  fullLastName: string;
  documentTypeId: number;
  document: string;
  dateBorn: string;
  phoneNumber: string;
  epsId: number;
  gender: string;
  healthRegime: string;
}

export interface PersonaCreada extends PersonaCreacion {
  id: number;
}

export interface DoctorCreacion {
  specialty: string;
  emailDoctor: string;
  image: string;
  active: boolean;
  personId: number;
}

export interface DoctorCompleto {
  persona: PersonaCreacion;
  doctor: DoctorCreacion;
}

@Component({
  selector: 'app-form-doctor',
  standalone: false,
  templateUrl: './form-doctor.component.html',
  styleUrls: ['./form-doctor.component.css']
})
export class FormDoctorComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: any;

  @Output() formSubmit = new EventEmitter<DoctorCreacion>();
  @Output() personaCreated = new EventEmitter<PersonaCreacion>();
  @Output() modalClosed = new EventEmitter<{ discardPersona?: boolean; personaId?: number }>();

  personaForm: FormGroup;
  doctorForm: FormGroup;
  currentStep: number = 1;
  personaCreada: PersonaCreada | null = null;
  isCreatingPersona: boolean = false;
  isCreatingDoctor: boolean = false;
  imagePreview: string | null = null;

  // Catálogos (puedes sustituirlos por inputs/datos de servicio si lo prefieres)
  tiposDocumento = [
    { id: 1, nombre: 'Cédula de Ciudadanía' },
    { id: 2, nombre: 'Tarjeta de Identidad' },
    { id: 3, nombre: 'Cédula de Extranjería' },
    { id: 4, nombre: 'Pasaporte' }
  ];

  epsOptions = [
    { id: 1, nombre: 'Sura' },
    { id: 2, nombre: 'Nueva EPS' },
    { id: 3, nombre: 'Sanitas' },
    { id: 4, nombre: 'Compensar' },
    { id: 5, nombre: 'Famisanar' }
  ];

  specialties = [
    'Medicina General',
    'Cardiología',
    'Dermatología',
    'Ginecología',
    'Oftalmología',
    'Pediatría',
    'Psiquiatría',
    'Radiología',
    'Traumatología',
    'Urología'
  ];

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef?: MatDialogRef<FormDoctorComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: { specialties?: string[] }
  ) {
    this.personaForm = this.createPersonaForm();
    this.doctorForm = this.createDoctorForm();
  }

  ngOnInit(): void {
    // Si recibimos especialidades por diálogo, sobreescribimos
    if (this.dialogData?.specialties?.length) {
      this.specialties = this.dialogData.specialties;
    }

    if (this.data && this.modo === 'edit') {
      // Lógica para edición futura si aplica
    }
  }

  // -------- Builders --------
  private createPersonaForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      fullLastName: ['', [Validators.required, Validators.minLength(2)]],
      documentTypeId: ['', [Validators.required]],
      document: ['', [Validators.required, Validators.minLength(6)]],
      dateBorn: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      epsId: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      healthRegime: ['', [Validators.required]]
    });
  }

  private createDoctorForm(): FormGroup {
    return this.fb.group({
      specialty: ['', [Validators.required]],
      emailDoctor: ['', [Validators.required, Validators.email]],
      image: [''],
      active: [true]
    });
  }

  // -------- Paso 1: Persona --------
  onSubmitPersona(): void {
    if (this.personaForm.valid) {
      this.isCreatingPersona = true;
      const personaData: PersonaCreacion = this.personaForm.value;
      this.personaCreated.emit(personaData); // el padre hará la creación y llamará a onPersonaCreatedSuccess/Error
    } else {
      this.markFormGroupTouched(this.personaForm);
    }
  }

  onPersonaCreatedSuccess(personaCreada: PersonaCreada): void {
    this.personaCreada = personaCreada;
    this.isCreatingPersona = false;
    this.currentStep = 2;
  }

  onPersonaCreatedError(): void {
    this.isCreatingPersona = false;
  }

  // -------- Paso 2: Doctor --------
  onSubmitDoctor(): void {
    if (this.doctorForm.valid && this.personaCreada) {
      this.isCreatingDoctor = true;
      const doctorData: DoctorCreacion = {
        ...this.doctorForm.value,
        personId: this.personaCreada.id
      } as DoctorCreacion;

      this.formSubmit.emit(doctorData); // el padre hará la creación y llamará a onDoctorCreatedSuccess/Error
    } else {
      this.markFormGroupTouched(this.doctorForm);
    }
  }

  onDoctorCreatedSuccess(): void {
    this.isCreatingDoctor = false;
  }

  onDoctorCreatedError(): void {
    this.isCreatingDoctor = false;
  }

  // -------- Navegación / Cierre --------
  goBack(): void {
    this.currentStep = 1;
    this.personaCreada = null;
    this.doctorForm.reset();
    this.doctorForm.patchValue({ active: true });
  }

  closeDialog(result?: any): void {
    const payload = this.personaCreada ? { discardPersona: true, personaId: this.personaCreada.id } : { discardPersona: false };
    this.modalClosed.emit(payload);
    this.dialogRef?.close(result ?? false);
  }

  // -------- Utilidades UI --------
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => control.markAsTouched());
  }

  getFieldError(fieldName: string): string {
    const currentForm = this.currentStep === 1 ? this.personaForm : this.doctorForm;
    const field = currentForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Ingresa un correo electrónico válido';
      if (field.errors['pattern']) return 'Formato inválido';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'fullName': 'Nombres',
      'fullLastName': 'Apellidos',
      'documentTypeId': 'Tipo de documento',
      'document': 'Número de documento',
      'dateBorn': 'Fecha de nacimiento',
      'phoneNumber': 'Número de teléfono',
      'epsId': 'EPS',
      'gender': 'Género',
      'healthRegime': 'Régimen de salud',
      'specialty': 'Especialidad',
      'emailDoctor': 'Correo electrónico',
      'image': 'Imagen'
    };
    return labels[fieldName] || fieldName;
  }

  onImageSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        this.imagePreview = base64String;
        this.doctorForm.patchValue({ image: base64String });
      };
      reader.readAsDataURL(file);
    }
  }
}
