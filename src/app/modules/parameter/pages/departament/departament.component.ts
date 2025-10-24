import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DepartamentService } from '../../../../shared/services/departament.service';
import { DepartamentList } from '../../../../shared/Models/parameter/Departament';
import { DialogContainerComponent } from '../../../../shared/components/Modal/dialog-container/dialog-container.component';
import Swal from 'sweetalert2';
import { ColumnDefinition } from '../../../../shared/Models/Tables/TableModels';


@Component({
  selector: 'app-departament',
  standalone: true,
  templateUrl: './departament.component.html',
  styleUrl: './departament.component.css',
})
export class DepartamentComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private departamentService: DepartamentService
  ) {}

  dataSource: DepartamentList[] = [];
  searchTerm = '';

  columnDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'text' },
    { key: 'name', label: 'Nombre' },
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
    this.cargarDepartamentos();
  }

  /** 🔄 Cargar todos los departamentos */
  cargarDepartamentos(): void {
    this.departamentService.traerTodo().subscribe({
      next: (departamentos) => (this.dataSource = departamentos),
      error: (err) => {
        console.error('Error al cargar departamentos:', err);
        Swal.fire('Error', 'No se pudieron cargar los departamentos.', 'error');
      },
    });
  }

  /** 🔍 Filtro de búsqueda */
  get filteredDataSource(): DepartamentList[] {
    const q = this.searchTerm.toLowerCase().trim();
    return this.dataSource.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }

  /** 🗑️ Eliminar departamento */
  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el departamento permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.departamentService.eliminar(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'El departamento fue eliminado correctamente.',
              'success'
            );
            this.cargarDepartamentos();
          },
          error: (err) => {
            console.error('Error al eliminar departamento:', err);
            Swal.fire('Error', 'No se pudo eliminar el departamento.', 'error');
          },
        });
      }
    });
  }

  /** ✏️ Crear o editar departamento */
  abrirFormulario(modo: 'create' | 'edit', data?: DepartamentList): void {
    import('../../Components/forms/FormsBase/form-departament/form-departament.component').then(
      ({ FormDepartamentComponent }) => {
        const dialogRef = this.dialog.open(FormDepartamentComponent, {
          width: '600px',
          data: { modo, data },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (!result) return;

          const action =
            modo === 'create'
              ? this.departamentService.crear(result)
              : this.departamentService.actualizar(result);

          action.subscribe({
            next: () => {
              Swal.fire(
                'Éxito',
                modo === 'create'
                  ? 'El departamento fue creado correctamente.'
                  : 'El departamento fue actualizado correctamente.',
                'success'
              );
              this.cargarDepartamentos();
            },
            error: (err) => {
              console.error('Error al guardar departamento:', err);
              Swal.fire('Error', 'No se pudo guardar el departamento.', 'error');
            },
          });
        });
      }
    );
  }

  /** ⚙️ Acciones emitidas desde la tabla genérica */
  handleAction(e: { action: string; element: any }) {
    const { action, element } = e;
    if (action === 'delete') this.eliminar(element.id || element.departamentId);
    if (action === 'edit') this.abrirFormulario('edit', element);
  }
}