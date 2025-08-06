import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

export interface UsuarioCreacion {
  email: string;
  password: string;
  active: boolean;
  personId: number;
}

export interface UsuarioCompleto {
  persona: PersonaCreacion;
  usuario: UsuarioCreacion;
}

@Component({
  selector: 'app-form-user',
standalone:false,
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.css'
})
export class FormUserComponent implements OnInit {
@Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: any;
  @Output() formSubmit = new EventEmitter<UsuarioCreacion>();
  @Output() personaCreated = new EventEmitter<PersonaCreacion>();

  personaForm: FormGroup;
  usuarioForm: FormGroup;
  currentStep: number = 1;
  personaCreada: PersonaCreada | null = null;
  isCreatingPersona: boolean = false;
  isCreatingUsuario: boolean = false;

  // Datos de prueba para los selects
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

  constructor(private fb: FormBuilder) {
    this.personaForm = this.createPersonaForm();
    this.usuarioForm = this.createUsuarioForm();
  }

  ngOnInit(): void {
    if (this.data && this.modo === 'edit') {
      // Lógica para edición si se necesita después
    }
  }

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

  private createUsuarioForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      active: [true]
    });
  }

  onSubmitPersona(): void {
    if (this.personaForm.valid) {
      this.isCreatingPersona = true;
      
      // Simular la creación de persona (aquí irías al servicio)
      const personaData: PersonaCreacion = this.personaForm.value;
      
      // Emitir evento para que el componente padre maneje la creación
      this.personaCreated.emit(personaData);
    } else {
      this.markFormGroupTouched(this.personaForm);
    }
  }

  // Método para ser llamado desde el componente padre cuando la persona se crea exitosamente
  onPersonaCreatedSuccess(personaCreada: PersonaCreada): void {
    this.personaCreada = personaCreada;
    this.isCreatingPersona = false;
    this.currentStep = 2;
  }

  // Método para manejar errores en la creación de persona
  onPersonaCreatedError(): void {
    this.isCreatingPersona = false;
  }

  onSubmitUsuario(): void {
    if (this.usuarioForm.valid && this.personaCreada) {
      this.isCreatingUsuario = true;
      
      const usuarioData: UsuarioCreacion = {
        ...this.usuarioForm.value,
        personId: this.personaCreada.id
      };


      this.formSubmit.emit(usuarioData);
    } else {
      this.markFormGroupTouched(this.usuarioForm);
    }
  }

  // Método para ser llamado desde el componente padre cuando el usuario se crea exitosamente
  onUsuarioCreatedSuccess(): void {
    this.isCreatingUsuario = false;
  }

  // Método para manejar errores en la creación de usuario
  onUsuarioCreatedError(): void {
    this.isCreatingUsuario = false;
  }

  goBack(): void {
    this.currentStep = 1;
    this.personaCreada = null;
    this.usuarioForm.reset();
    this.usuarioForm.patchValue({ active: true });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const currentForm = this.currentStep === 1 ? this.personaForm : this.usuarioForm;
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
      'email': 'Correo electrónico',
      'password': 'Contraseña'
    };
    return labels[fieldName] || fieldName;
  }
}
