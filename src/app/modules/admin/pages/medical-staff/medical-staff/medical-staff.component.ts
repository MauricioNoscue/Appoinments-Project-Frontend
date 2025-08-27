import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { DoctorList } from '../../../../../shared/Models/hospital/DoctorListModel';
import { DoctorService } from '../../../../../shared/services/doctor.service';
import { MaterialModule } from "../../../../../shared/material.module";
import { MatCard } from "@angular/material/card";
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
export class MedicalStaffComponent implements OnInit, OnDestroy, AfterViewInit {
  // Hacer Math disponible para el template
  Math = Math;

  // UI state
  loading = false;
  errorMsg = '';
  doctors: DoctorList[] = [];
  total = 0;

  // filtros + paginación
  form: FormGroup;
  pageIndex = 0;
  pageSize = 9; // 3 columnas x 3 filas aprox. como el mockup
  specialties: string[] = []; // se cargan de API o se derivan de los doctores
  searchControl!: FormControl;

  // carousel properties
  carouselPosition = 0;
  currentPage = 0;
  maxCarouselPosition = 0;

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

    this.doctorService
      .traerTodo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DoctorList[]) => {
          this.doctors = res;
          this.total = res.length;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMsg = 'No fue posible cargar el personal médico.';
          console.error(err);
        },
      });
  }

  loadSpecialties(): void {
    this.doctorService
      .traerTodo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DoctorList[]) => {
          const set = new Set(res.map(d => (d.specialty || '').trim()).filter(Boolean));
          this.specialties = Array.from(set).sort((a, b) => a.localeCompare(b));
        },
        error: () => {}, // silencioso
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
    return Math.ceil(this.doctors.length / 9);
  }

  scrollCards(direction: 'left' | 'right'): void {
    const gridElement = document.querySelector('.cards-grid');
    if (!gridElement) return;

    const cardWidth = 290 + 24; // width + gap
    const cardsPerView = 3;
    const scrollAmount = cardWidth * cardsPerView;

    if (direction === 'left' && this.carouselPosition > 0) {
      this.carouselPosition--;
      gridElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else if (direction === 'right' && this.carouselPosition < this.maxCarouselPosition) {
      this.carouselPosition++;
      gridElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    this.currentPage = this.carouselPosition;
  }

  ngAfterViewInit(): void {
    this.maxCarouselPosition = Math.max(0, this.totalPages - 1);
  }
}
