import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { DoctorList } from '../../../../../shared/Models/hospital/DoctorListModel';
import { DoctorService } from '../../../../../shared/services/doctor.service';
import { PersonaService } from '../../../../../shared/services/persona.service';

import { FilterDoctorsDialogComponent } from '../dialogs/filter-doctors-dialog/filter-doctors-dialog.component';
import { DoctorCreatedDialogComponent } from '../dialogs/doctor-created-dialog/doctor-created-dialog.component';
import {
  FormDoctorComponent,
  PersonaCreacion,
  PersonaCreada,
  DoctorCreacion
} from '../../../Components/forms/FormsBase/form-doctor/form-doctor.component';

interface PagedResult<T> {
  items: T[];
  total: number;
}

@Component({
  selector: 'app-medical-staff',
  templateUrl: './medical-staff.component.html',
  styleUrls: ['./medical-staff.component.css'],
  standalone: false,
})
export class MedicalStaffComponent implements OnInit, OnDestroy, AfterViewInit {
  // Hacer Math disponible para el template
  Math = Math;

  // UI state
  loading = false;
  errorMsg = '';
  doctors: DoctorList[] = [];
  paginatedDoctors: DoctorList[] = [];
  total = 0;

  // Dialog ref para acceder al componente dentro del modal
  private currentDoctorDialogRef?: MatDialogRef<FormDoctorComponent>;

  // Form state
  isCreatingDoctor = false;
  private personaIdCreada!: number;
  private personaDataCreada: PersonaCreada | null = null;

  // filtros + paginación
  form: FormGroup;
  pageIndex = 0;
  pageSize = 12;
  specialties: string[] = [];
  searchControl!: FormControl;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private doctorService: DoctorService,
    private personaService: PersonaService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      search: [''],
      specialty: [''],
    });
    this.searchControl = this.form.get('search') as FormControl;
  }

  ngOnInit(): void {
    // reaccionar a cambios de filtros
    this.form.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageIndex = 0; // reset de paginación al filtrar
        this.loadDoctors();
      });

    this.loadDoctors();
    this.loadSpecialties(); // opcional
  }

  ngAfterViewInit(): void {
    // nada por ahora
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDoctors(): void {
    this.loading = true;
    this.errorMsg = '';

    // Obtener valores de filtros
    const filters = this.form.value;

    this.doctorService
      .traerDoctorPersona()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          const list: DoctorList[] = Array.isArray(res) ? res : (res ? [res] : []);

          // Filtrar localmente los resultados
          this.doctors = list.filter(doctor => {
            const matchesSearch = !filters.search ||
              (doctor.fullName && doctor.fullName.toLowerCase().includes(filters.search.toLowerCase())) ||
              (doctor.emailDoctor && doctor.emailDoctor.toLowerCase().includes(filters.search.toLowerCase()));

            const matchesSpecialty = !filters.specialty ||
              (doctor.specialty && doctor.specialty === filters.specialty);

            return matchesSearch && matchesSpecialty;
          });

          this.total = this.doctors.length;

          // Aplicar paginación
          const startIndex = this.pageIndex * this.pageSize;
          const endIndex = startIndex + this.pageSize;
          this.paginatedDoctors = this.doctors.slice(startIndex, endIndex);

          this.loading = false;
        },
        (err: any) => {
          this.loading = false;
          this.errorMsg = 'No fue posible cargar el personal médico.';
          console.error(err);
        }
      );
  }

  loadSpecialties(): void {
    // Cargar todas las especialidades sin filtros
    this.doctorService
      .traerTodo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DoctorList[]) => {
          const set = new Set(res.map(d => (d.specialty || '').trim()).filter(Boolean));
          this.specialties = Array.from(set).sort((a, b) => a.localeCompare(b));
        },
        error: () => { },
      });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadDoctors();
  }

  clearFilters(): void {
    this.form.patchValue({ search: '', specialty: '' }, { emitEvent: true });
  }

  /** Abre el formulario como MatDialog centrado */
  openCreateDialog(): void {
    this.currentDoctorDialogRef = this.dialog.open(FormDoctorComponent, {
      width: '720px',
      maxWidth: '92vw',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      hasBackdrop: true,
      panelClass: 'doctor-dialog'
    });

    const cmp = this.currentDoctorDialogRef.componentInstance;

    // Conecta los @Output() del formulario a la lógica existente
    cmp.personaCreated.subscribe((persona: PersonaCreacion) => this.onPersonaCreated(persona));
    cmp.formSubmit.subscribe((doctor: DoctorCreacion) => this.onDoctorCreated(doctor));
    cmp.modalClosed.subscribe((payload) => this.cancelCreateDoctor(payload));

    this.currentDoctorDialogRef.afterClosed().subscribe((ok) => {
      this.currentDoctorDialogRef = undefined;
      if (ok) {
        this.pageIndex = 0;
        this.loadDoctors();
      }
    });
  }

  /** Cerrar modal manualmente (por botón cancelar o output) */
  cancelCreateDoctor(payload: { discardPersona?: boolean; personaId?: number }): void {
    if (payload.discardPersona && payload.personaId) {
      // Eliminar la persona de la base de datos para evitar registros no utilizados
      this.personaService.eliminar(payload.personaId).subscribe({
        next: () => {
          console.log('Persona eliminada exitosamente:');
        },
        error: (error) => {
          console.error('Error al eliminar la persona:', error);
          this.snackBar.open('Error al eliminar la persona. Contacte al administrador.', 'Cerrar', { duration: 4000 });
        }
      });
      // Reset persona data
      this.personaIdCreada = 0;
      this.personaDataCreada = null;
    }
    this.currentDoctorDialogRef?.close(false);
    this.currentDoctorDialogRef = undefined;
    this.snackBar.open('Registro de doctor cancelado', 'Cerrar', { duration: 2000 });
  }

  /** Paso 1: crear persona (llamado por el @Output del form) */
  onPersonaCreated(personaData: PersonaCreacion): void {
    this.personaService.crear(personaData).subscribe({
      next: (response: any) => {
        this.personaIdCreada = response.id;

        this.personaDataCreada = {
          ...personaData,
          id: response.id
        } as PersonaCreada;

        this.snackBar.open('Persona registrada exitosamente', 'Cerrar', { duration: 2000 });

        // Notificar al componente del dialog para avanzar al paso 2
        const cmp = this.currentDoctorDialogRef?.componentInstance;
        if (cmp && typeof cmp.onPersonaCreatedSuccess === 'function') {
          cmp.onPersonaCreatedSuccess(this.personaDataCreada);
        }
      },
      error: (error) => {
        console.error('Error al crear persona:', error);
        this.snackBar.open('Error al crear la persona. Verifique los datos e intente nuevamente.', 'Cerrar', { duration: 4000 });

        const cmp = this.currentDoctorDialogRef?.componentInstance;
        if (cmp && typeof cmp.onPersonaCreatedError === 'function') {
          cmp.onPersonaCreatedError();
        }
      }
    });
  }

  /** Paso 2: crear doctor (llamado por el @Output del form) */
  onDoctorCreated(doctorData: DoctorCreacion): void {
    this.isCreatingDoctor = true;

    // Objeto en el formato que espera el backend
    const doctorDataCompleto = {
      specialty: doctorData.specialty,
      emailDoctor: doctorData.emailDoctor,
      image: doctorData.image,
      active: doctorData.active,
      personId: this.personaIdCreada // ≈ personId; ajusta cuando el backend acepte personId
    };

    this.doctorService.crear(doctorDataCompleto).subscribe({
      next: (response: any) => {
        this.isCreatingDoctor = false;
        this.currentDoctorDialogRef?.close(true);

        // Crear objeto DoctorList con los datos disponibles
        const newDoctor: DoctorList = {
          id: response?.id || 0,
          specialty: doctorData.specialty,
          active: doctorData.active,
          image: doctorData.image,
          fullName: this.personaDataCreada?.fullName + ' ' + this.personaDataCreada?.fullLastName,
          emailDoctor: doctorData.emailDoctor,
          isDeleted: false,
          registrationDate: new Date()
        };

        // Mostrar modal de confirmación
        this.dialog.open(DoctorCreatedDialogComponent, {
          width: '700px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          disableClose: true,
          data: { doctor: newDoctor },
          panelClass: 'doctor-created-dialog'
        }).afterClosed().subscribe(() => {
          this.pageIndex = 0;
          this.loadDoctors();
        });
      },
      error: (error) => {
        this.isCreatingDoctor = false;
        console.error('Error al crear doctor:', error);

        let errorMessage = 'Error al crear el doctor. ';
        if (error.status === 400) {
          errorMessage += 'Verifique que todos los campos sean correctos.';
        } else if (error.status === 409) {
          errorMessage += 'Ya existe un doctor con estos datos.';
        } else if (error.status === 500) {
          errorMessage += 'Error interno del servidor. Intente nuevamente.';
        } else {
          errorMessage += 'Intente nuevamente o contacte al administrador.';
        }

        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });

        const cmp = this.currentDoctorDialogRef?.componentInstance;
        if (cmp && typeof cmp.onDoctorCreatedError === 'function') {
          cmp.onDoctorCreatedError();
        }
      }
    });
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadDoctors();
    }
  }

  nextPage(): void {
    if ((this.pageIndex + 1) * this.pageSize < this.total) {
      this.pageIndex++;
      this.loadDoctors();
    }
  }

  openFilters(): void {
    const ref = this.dialog.open(FilterDoctorsDialogComponent, {
      width: '400px',
      data: { specialties: this.specialties, selected: this.form.value.specialty }
    });

    ref.afterClosed().subscribe((result: { specialty: string | null } | undefined) => {
      if (result) {
        this.form.patchValue({ specialty: result.specialty });
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }
}
