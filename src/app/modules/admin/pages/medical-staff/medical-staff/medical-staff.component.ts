import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { DoctorList } from '../../../../../shared/Models/hospital/DoctorListModel';
import { Specialty } from '../../../../../shared/Models/hospital/SpecialtyModel';
import { DoctorService } from '../../../../../shared/services/doctor.service';
import { PersonaService } from '../../../../../shared/services/persona.service';
import { SpecialtyService } from '../../../../../shared/services/Hospital/specialty.service';

import { FilterDoctorsDialogComponent } from '../dialogs/filter-doctors-dialog/filter-doctors-dialog.component';
import { DoctorCreatedDialogComponent } from '../dialogs/doctor-created-dialog/doctor-created-dialog.component';
import { EditDoctorDialogComponent, EditDoctorDialogData } from '../dialogs/edit-doctor-dialog/edit-doctor-dialog/edit-doctor-dialog.component';
import {
  FormDoctorComponent,
  PersonaCreacion,
  PersonaCreada,
  DoctorCreacion
} from '../../../Components/forms/FormsBase/form-doctor/form-doctor.component';

@Component({
  selector: 'app-medical-staff',
  templateUrl: './medical-staff.component.html',
  styleUrls: ['./medical-staff.component.css'],
  standalone: false,
})
export class MedicalStaffComponent implements OnInit, OnDestroy, AfterViewInit {
  // === Estado general ===
  loading = false;
  errorMsg = '';
  doctors: DoctorList[] = [];
  specialties: Specialty[] = [];

  // === Paginación y filtros ===
  form: FormGroup;
  searchControl!: FormControl;
  pageIndex = 0;
  pageSize = 12;

  // === Control del ciclo de vida ===
  private destroy$ = new Subject<void>();

  // === Control modal ===
  private currentDoctorDialogRef?: MatDialogRef<any>;
  private personaIdCreada!: number;
  private personaDataCreada: PersonaCreada | null = null;
  isCreatingDoctor = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private doctorService: DoctorService,
    private personaService: PersonaService,
    private specialtyService: SpecialtyService
  ) {
    this.form = this.fb.group({
      search: [''],
      specialty: [''],
    });
    this.searchControl = this.form.get('search') as FormControl;
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.pageIndex = 0);

    this.loadDoctors();
    this.loadSpecialties();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // === Cargar datos ===
  loadDoctors(): void {
    this.loading = true;
    this.errorMsg = '';

    this.doctorService
      .traerDoctorPersona()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.doctors = Array.isArray(res) ? res : (res ? [res] : []);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'No fue posible cargar el personal médico.';
        }
      });
  }

  loadSpecialties(): void {
    this.specialtyService
      .traerTodo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Specialty[]) => {
          this.specialties = res.sort((a, b) => a.name.localeCompare(b.name));
        },
        error: () => {}
      });
  }

  // === Filtros ===
  get filteredDoctors(): DoctorList[] {
    const filters = this.form.value;
    const search = (filters.search || '').toLowerCase();
    const specialty = (filters.specialty || '').toLowerCase();

    return this.doctors.filter(d => {
      const matchesSearch =
        !search ||
        (d.fullName && d.fullName.toLowerCase().includes(search)) ||
        (d.emailDoctor && d.emailDoctor.toLowerCase().includes(search));

      const matchesSpecialty =
        !specialty ||
        (d.specialtyName && d.specialtyName.toLowerCase().includes(specialty));

      return matchesSearch && matchesSpecialty;
    });
  }

  clearFilters(): void {
    this.form.patchValue({ search: '', specialty: '' });
  }

  // === Paginación simple ===
  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // === CRUD: creación / edición / eliminación ===
  openCreateDialog(): void {
    this.currentDoctorDialogRef = this.dialog.open(FormDoctorComponent, {
      width: '720px',
      maxWidth: '92vw',
      maxHeight: '90vh',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'doctor-dialog'
    });

    const cmp = this.currentDoctorDialogRef.componentInstance;

    cmp.personaCreated.subscribe((p: PersonaCreacion) => this.onPersonaCreated(p));
    cmp.formSubmit.subscribe((d: DoctorCreacion) => this.onDoctorCreated(d));
    cmp.modalClosed.subscribe((payload: { discardPersona?: boolean; personaId?: number }) => this.cancelCreateDoctor(payload));

    this.currentDoctorDialogRef.afterClosed().subscribe((ok) => {
      this.currentDoctorDialogRef = undefined;
      if (ok) this.loadDoctors();
    });
  }

  cancelCreateDoctor(payload: { discardPersona?: boolean; personaId?: number }): void {
    if (payload.discardPersona && payload.personaId) {
      this.personaService.eliminar(payload.personaId).subscribe({
        error: (err) => {
          console.error('Error al eliminar persona', err);
          Swal.fire('Error', 'No se pudo eliminar la persona.', 'error');
        }
      });
      this.personaIdCreada = 0;
      this.personaDataCreada = null;
    }
    this.currentDoctorDialogRef?.close(false);
    Swal.fire('Cancelado', 'Registro de doctor cancelado', 'info');
  }

  onPersonaCreated(personaData: PersonaCreacion): void {
    this.personaService.crear(personaData).subscribe({
      next: (resp: any) => {
        this.personaIdCreada = resp.id;
        this.personaDataCreada = { ...personaData, id: resp.id } as PersonaCreada;
        Swal.fire('Éxito', 'Persona registrada exitosamente', 'success');
        const cmp = this.currentDoctorDialogRef?.componentInstance;
        cmp?.onPersonaCreatedSuccess?.(this.personaDataCreada);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear la persona.', 'error');
        const cmp = this.currentDoctorDialogRef?.componentInstance;
        cmp?.onPersonaCreatedError?.();
      }
    });
  }

  onDoctorCreated(doctorData: DoctorCreacion): void {
    this.isCreatingDoctor = true;
    const doctorPayload = {
      specialtyId: doctorData.specialtyId,
      emailDoctor: doctorData.emailDoctor,
      image: doctorData.image,
      active: doctorData.active,
      personId: this.personaIdCreada
    };

    this.doctorService.crearDoctor(doctorPayload).subscribe({
      next: (response: any) => {
        this.isCreatingDoctor = false;
        this.currentDoctorDialogRef?.close(true);
        const newDoctor: DoctorList = {
          id: response?.id || 0,
          specialtyId: doctorData.specialtyId,
          specialtyName: this.specialties.find(s => s.id === doctorData.specialtyId)?.name || '—',
          active: doctorData.active,
          image: doctorData.image,
          fullName: `${this.personaDataCreada?.fullName} ${this.personaDataCreada?.fullLastName}`,
          emailDoctor: doctorData.emailDoctor,
          isDeleted: false,
          registrationDate: new Date()
        };
        this.dialog.open(DoctorCreatedDialogComponent, {
          width: '700px',
          data: { doctor: newDoctor },
          disableClose: true,
          panelClass: 'doctor-created-dialog'
        }).afterClosed().subscribe(() => this.loadDoctors());
      },
      error: (err) => {
        this.isCreatingDoctor = false;
        Swal.fire('Error', 'No se pudo crear el doctor.', 'error');
        this.currentDoctorDialogRef?.componentInstance?.onDoctorCreatedError?.();
      }
    });
  }

  onEditDoctor(doctor: DoctorList): void {
    this.openEditDialog(doctor);
  }

  private openEditDialog(doctor: DoctorList): void {
    const openDialog = (doc: DoctorList) => {
      const dialogData: EditDoctorDialogData = {
        doctor: { ...doc, personId: doc.personId ?? 0 }
      };
      this.currentDoctorDialogRef = this.dialog.open(EditDoctorDialogComponent, {
        width: '720px',
        data: dialogData,
        disableClose: true,
        panelClass: 'doctor-dialog'
      });

      this.currentDoctorDialogRef.afterClosed().subscribe((ok) => {
        this.currentDoctorDialogRef = undefined;
        if (ok) {
          this.loadDoctors();
          Swal.fire('Éxito', 'Doctor actualizado exitosamente', 'success');
        }
      });
    };

    if (doctor.personId) openDialog(doctor);
    else {
      this.doctorService.traerDoctorConPersona(doctor.id).subscribe({
        next: (fullDoctor) => openDialog({ ...doctor, personId: fullDoctor.personId }),
        error: () => Swal.fire('Error', 'No se pudo obtener la información del doctor', 'error')
      });
    }
  }

  onDeleteDoctor(doctor: DoctorList): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar al doctor ${doctor.fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorService.eliminar(doctor.id).subscribe({
          next: () => {
            this.loadDoctors();
            Swal.fire('Eliminado', 'Doctor eliminado exitosamente', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el doctor', 'error')
        });
      }
    });
  }

  // === Filtros ===
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

  // === trackBy para ngFor ===
  trackById(_i: number, item: DoctorList): number {
    return item.id;
  }
}
