import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogContainerComponent } from "../../../../shared/components/Modal/dialog-container/dialog-container.component";
import { InstitutionList, Institution } from "../../../../shared/Models/parameter/InstitutionModel";
import { InstitutionService } from "../../../../shared/services/institution.service";
import Swal from "sweetalert2";
import { ColumnDefinition } from "../../../../shared/Models/Tables/TableModels";

@Component({
  selector: 'app-institutions',
  standalone: true,

  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InstitutionsComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private institutionService: InstitutionService
  ) {}

  dataSource: InstitutionList[] = [];
  searchTerm = '';

  columnDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'text' },
    { key: 'name', label: 'Nombre' },
    { key: 'nit', label: 'NIT' },
    { key: 'email', label: 'Email' },
    { key: 'cityName', label: 'Ciudad' },
    {
      key: 'registrationDate',
      label: 'Fecha Registro',
      type: 'text',
      format: (x) =>
        x.registrationDate
          ? new Date(x.registrationDate).toLocaleDateString('es-CO')
          : 'Sin registro',
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'chip',
      colorFn: (x) => (x.isDeleted ? 'warn' : 'primary'),
      format: (x) => (x.isDeleted ? 'Inactivo' : 'Activo'),
    },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  displayedColumns: string[] = this.columnDefs.map((c) => c.key);

  ngOnInit(): void {
    this.cargarInstituciones();
  }

  /** 🔄 Cargar todas las instituciones */
  cargarInstituciones(): void {
    this.institutionService.traerTodo().subscribe({
      next: (institutions) => (this.dataSource = institutions),
      error: (err) => {
        console.error('Error al cargar instituciones:', err);
        Swal.fire('Error', 'No se pudieron cargar las instituciones.', 'error');
      },
    });
  }

  /** 🔍 Filtro local */
  get filteredDataSource(): InstitutionList[] {
    const q = this.searchTerm.toLowerCase().trim();
    return this.dataSource.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.nit.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        (i.cityName ?? '').toLowerCase().includes(q)
    );
  }

  /** 🗑️ Eliminar institución */
  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la institución permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.institutionService.eliminar(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminada',
              'La institución fue eliminada correctamente.',
              'success'
            );
            this.cargarInstituciones();
          },
          error: (err) => {
            console.error('Error al eliminar institución:', err);
            Swal.fire('Error', 'No se pudo eliminar la institución.', 'error');
          },
        });
      }
    });
  }

  /** ➕ Crear / ✏️ Editar institución */
  abrirFormulario(modo: 'create' | 'edit', data?: Institution): void {
    import('../../Components/forms/FormsBase/form-institution/form-institution.component').then(
      ({ FormInstitutionComponent }) => {
        const dialogRef = this.dialog.open(FormInstitutionComponent, {
          width: '600px',
          data: { modo, data },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (!result) return;

          const action =
            modo === 'create'
              ? this.institutionService.crear(result)
              : this.institutionService.actualizar(result);

          action.subscribe({
            next: () => {
              Swal.fire(
                'Éxito',
                modo === 'create'
                  ? 'La institución fue creada correctamente.'
                  : 'La institución fue actualizada correctamente.',
                'success'
              );
              this.cargarInstituciones();
            },
            error: (err) => {
              console.error('Error al guardar institución:', err);
              Swal.fire('Error', 'No se pudo guardar la institución.', 'error');
            },
          });
        });
      }
    );
  }

  /** ⚙️ Acciones centralizadas desde la tabla */
  handleAction(e: { action: string; element: any }) {
    const { action, element } = e;
    if (action === 'delete') this.eliminar(element.id);
    if (action === 'edit') this.abrirFormulario('edit', element);
  }
}
