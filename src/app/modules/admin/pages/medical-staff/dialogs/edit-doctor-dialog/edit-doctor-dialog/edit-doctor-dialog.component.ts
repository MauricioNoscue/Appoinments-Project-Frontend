// admin/pages/medical-staff/dialogs/edit-doctor-dialog/edit-doctor-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DoctorService, DoctorUpdateDto } from '../../../../../../../shared/services/doctor.service';
import { SpecialtyService } from '../../../../../../../shared/services/Hospital/specialty.service';

export interface EditDoctorDialogData {
  doctor: {
    id: number;
    specialtyId: number;
    personId?: number;
    emailDoctor: string;
    image?: string;
    fullName?: string | null;
    specialtyName?: string;
    active: boolean;
  };
}

@Component({
  selector: 'app-edit-doctor-dialog',
  templateUrl: './edit-doctor-dialog.component.html',
  styleUrls: ['./edit-doctor-dialog.component.css'],
  standalone: false,
})
export class EditDoctorDialogComponent {
  form: FormGroup;
  saving = false;
  imagePreview: string | null = null;
  specialties: Array<{ id: number; name: string }> = [];

  constructor(
    private fb: FormBuilder,
    private doctorSvc: DoctorService,
    private specialtySvc: SpecialtyService,
    private ref: MatDialogRef<EditDoctorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditDoctorDialogData
  ) {
    const d = data.doctor || ({} as any);

    // Preview de imagen existente
    const raw = (d.image || '').trim();
    this.imagePreview = raw
      ? (raw.startsWith('data:') ? raw : `data:image/jpeg;base64,${raw}`)
      : null;

    this.form = this.fb.group({
      id: [d.id, [Validators.required]],
      specialtyId: [d.specialtyId, [Validators.required]],
      personId: [{ value: d.personId, disabled: true }, [Validators.required]],
      emailDoctor: [d.emailDoctor, [Validators.required, Validators.email]],
      image: [d.image || ''],
      active: [d.active]
    });

    // Cargar especialidades
    this.specialtySvc.traerTodo().subscribe({
      next: list => {
        this.specialties = list || [];
        // Asegurar que la especialidad actual esté en la lista
        if (d.specialtyId && !this.specialties.find(s => s.id === d.specialtyId)) {
          this.specialties.unshift({ id: d.specialtyId, name: d.specialtyName || 'Especialidad actual' });
        }
      },
      error: _ => { this.specialties = []; }
    });
  }

  close(): void { this.ref.close(false); }

  async onFile(ev: Event): Promise<void> {
    const input = ev.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { alert('Formato no permitido'); return; }

    try {
      // Comprimir imagen antes de procesar
      const compressedFile = await this.compressImage(file);
      const dataUrl = await this.readAsDataURL(compressedFile);
      this.imagePreview = dataUrl;

      // Mantener el data URL completo para consistencia con el formulario de crear
      this.form.patchValue({ image: dataUrl });
    } catch (error) {
      console.error('Error al comprimir imagen:', error);
      // Fallback: procesar archivo original
      const dataUrl = await this.readAsDataURL(file);
      this.imagePreview = dataUrl;
      this.form.patchValue({ image: dataUrl });
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

        // Convertir a blob con calidad baja
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

  private readAsDataURL(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  removeImage(): void {
    this.imagePreview = null;
    this.form.patchValue({ image: '' });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.saving = true;

    const value = this.form.getRawValue(); // incluye personId (disabled)
    const payload: DoctorUpdateDto = {
      id: value.id,
      specialtyId: value.specialtyId,
      personId: value.personId, // requerido por backend
      emailDoctor: value.emailDoctor,
      image: value.image || '',
      active: value.active
    };

    // Enviar datos al backend

    this.doctorSvc.actualizarDoctor(payload).subscribe({
      next: () => {
        this.ref.close(true);
      },
      error: (err) => {
        this.saving = false;
        Swal.fire('Error', 'Error al actualizar el doctor. Verifique los datos e intente nuevamente.', 'error');
      }
    });
  }
}
