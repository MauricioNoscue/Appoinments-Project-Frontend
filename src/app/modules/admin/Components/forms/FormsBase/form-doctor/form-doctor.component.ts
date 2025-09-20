import { Component, EventEmitter, Input, OnInit, Output, Optional, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

// Interfaces
import { EpsService } from '../../../../../../shared/services/Hospital/eps.service';
import { DocumentTypeService } from '../../../../../../shared/services/document-type.service';
import { SpecialtyService } from '../../../../../../shared/services/Hospital/specialty.service';
import { EpsList } from '../../../../../../shared/Models/hospital/epsListModel';
import { DocumentType } from '../../../../../../shared/Models/documentTypeModel';
import { Specialty } from '../../../../../../shared/Models/hospital/SpecialtyModel';
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
  specialtyId: number;
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
export class FormDoctorComponent implements OnInit, OnDestroy {
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
  editingDoctor: any = null;

  // Catálogos dinámicos
  tiposDocumento: DocumentType[] = [];
  epsOptions: EpsList[] = [];
  specialties: Specialty[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private epsService: EpsService,
    private documentTypeService: DocumentTypeService,
    private specialtyService: SpecialtyService,
    @Optional() private dialogRef?: MatDialogRef<FormDoctorComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: { specialties?: Specialty[] }
  ) {
    this.personaForm = this.createPersonaForm();
    this.doctorForm = this.createDoctorForm();
  }

  ngOnInit(): void {
    // Cargar datos dinámicos
    this.loadDocumentTypes();
    this.loadEpsOptions();
    this.loadSpecialties();

    // Si recibimos especialidades por diálogo, sobreescribimos
    if (this.dialogData?.specialties?.length) {
      this.specialties = this.dialogData.specialties;
    }

    if (this.data && this.modo === 'edit') {
      // Cargar datos para edición
      this.loadDoctorDataForEdit();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDoctorDataForEdit(): void {
    this.editingDoctor = this.data;
    this.currentStep = 2; // Ir directamente al paso 2 para edición

    // Cargar datos en el formulario de doctor
    this.doctorForm.patchValue({
      specialtyId: this.data.specialtyId,
      emailDoctor: this.data.emailDoctor,
      image: this.data.image,
      active: this.data.active
    });

    // Mostrar preview de imagen si existe
    if (this.data.image) {
      this.imagePreview = this.data.image;
    }

    // Simular persona creada para mostrar en el summary
    this.personaCreada = {
      id: this.data.personId || 0,
      fullName: this.data.fullName?.split(' ')[0] || '',
      fullLastName: this.data.fullName?.split(' ').slice(1).join(' ') || '',
      documentTypeId: 0,
      document: '',
      dateBorn: '',
      phoneNumber: '',
      epsId: 0,
      gender: '',
      healthRegime: ''
    };
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
      specialtyId: ['', [Validators.required]],
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
      'specialtyId': 'Especialidad',
      'emailDoctor': 'Correo electrónico',
      'image': 'Imagen'
    };
    return labels[fieldName] || fieldName;
  }

  private loadDocumentTypes(): void {
    this.documentTypeService.traerTodo().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: DocumentType[]) => {
        this.tiposDocumento = data;
      },
      error: (err) => {
        // Error al cargar tipos de documento
      }
    });
  }

  private loadEpsOptions(): void {
    this.epsService.traerTodo().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: EpsList[]) => {
        this.epsOptions = data;
      },
      error: (err) => {
        // Error al cargar EPS
      }
    });
  }

  private loadSpecialties(): void {
    this.specialtyService.traerTodo().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: Specialty[]) => {
        this.specialties = data;
      },
      error: (err) => {
        // Error al cargar especialidades
      }
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      // Comprimir imagen antes de procesar
      this.compressImage(file).then(compressedFile => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          this.imagePreview = base64String;
          this.doctorForm.patchValue({ image: base64String });
        };
        reader.readAsDataURL(compressedFile);
      }).catch(error => {
        console.error('Error al comprimir imagen:', error);
        // Fallback: procesar archivo original
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          this.imagePreview = base64String;
          this.doctorForm.patchValue({ image: base64String });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  private compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Dimensiones optimizadas para calidad visual en tarjetas
        const maxWidth = 400;  // Mejor resolución para tarjetas de 180px
        const maxHeight = 300; // Manteniendo aspect ratio 4:3
        let { width, height } = img;

        // Calcular nuevas dimensiones manteniendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen comprimida
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir a blob con calidad mucho más baja
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('No se pudo comprimir la imagen'));
          }
        }, file.type, 0.7); // Calidad 70% para mejor apariencia visual
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }
}
