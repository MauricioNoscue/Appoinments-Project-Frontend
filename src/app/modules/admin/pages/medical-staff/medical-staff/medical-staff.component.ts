import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { DoctorList } from '../../../../../shared/Models/hospital/DoctorListModel';
import { DoctorService } from '../../../../../shared/services/doctor.service';
import { DoctorFormDialogComponent } from '../dialogs/doctor-form-dialog/doctor-form-dialog.component';
import { FilterDoctorsDialogComponent } from '../dialogs/filter-doctors-dialog/filter-doctors-dialog.component';
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
export class MedicalStaffComponent implements OnInit, OnDestroy {
  // Hacer Math disponible para el template
  Math = Math;

  // UI state
  loading = false;
  errorMsg = '';
  doctors: DoctorList[] = [];
  paginatedDoctors: DoctorList[] = [];
  total = 0;

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
    private doctorService: DoctorService
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
          // Asegurar que trabajamos con un arreglo aunque el observable devuelva un solo elemento
          const list: DoctorList[] = Array.isArray(res) ? res : (res ? [res] : []);

          // Filtrar localmente los resultados
          this.doctors = list.filter(doctor => {
            // Filtrar por búsqueda (nombre)
            const matchesSearch = !filters.search ||
              (doctor.fullName && doctor.fullName.toLowerCase().includes(filters.search.toLowerCase())) ||
              (doctor.emailDoctor && doctor.emailDoctor.toLowerCase().includes(filters.search.toLowerCase()));
            
            // Filtrar por especialidad
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
        error: () => {},
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

  openCreateDialog(): void {
    const ref = this.dialog.open(DoctorFormDialogComponent, {
      width: '520px',
      disableClose: true,
      data: { specialties: this.specialties },
    });

    ref.afterClosed().subscribe((created) => {
      if (created) {
        this.pageIndex = 0;
        this.loadDoctors();
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
