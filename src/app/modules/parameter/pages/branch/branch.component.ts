import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BranchList } from '../../../../shared/Models/parameter/Branch';
import { BranchService } from '../../../../shared/services/branch.service';
import { FormBranchComponent } from '../../Components/forms/FormsBase/form-branch/form-branch.component';
import Swal from 'sweetalert2';
import { ColumnDefinition } from '../../../../shared/Models/Tables/TableModels';

@Component({
  selector: 'app-branch',
  standalone: false,
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css',
})
export class BranchComponent implements OnInit {
  constructor(private dialog: MatDialog, private branchService: BranchService) {}

  dataSource: BranchList[] = [];
  dataSourceFiltered: BranchList[] = [];
  searchTerm = '';

  //  Definición de columnas reutilizables
  columnDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'text' },
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Teléfono' },
    { key: 'address', label: 'Dirección' },
    { key: 'institutionName', label: 'Institución' },
    {
      key: 'registrationDate',
      label: 'Fecha Registro',
      type: 'text',
      format: (x) =>
        x.registrationDate
          ? new Date(x.registrationDate).toLocaleDateString('es-CO')
          : '',
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
    this.cargarSucursales();
  }

  /** 🔄 Cargar sucursales */
  cargarSucursales(): void {
    this.branchService.traerTodo().subscribe({
      next: (branches) => {
        this.dataSource = branches;
         this.dataSourceFiltered = [...this.dataSource]; 
      },
      error: (err) => {
        console.error('Error al cargar sucursales:', err);
        Swal.fire('Error', 'No se pudieron cargar las sucursales.', 'error');
      },
    });
  }

  /** 🔍 Filtro local */
  get filteredDataSource(): BranchList[] {
    const q = this.searchTerm.toLowerCase().trim();
    return this.dataSource.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.institutionName ?? '').toLowerCase().includes(q)
    );
  }

  /** 🗑️ Eliminar sucursal */
  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la sucursal permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.branchService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'Sucursal eliminada correctamente.', 'success');
            this.cargarSucursales();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar la sucursal.', 'error');
          },
        });
      }
    });
  }

  /** ➕ Crear / ✏️ Editar sucursal */
  abrirFormulario(modo: 'create' | 'edit', data?: BranchList): void {
    import('../../Components/forms/FormsBase/form-branch/form-branch.component').then(
      ({ FormBranchComponent }) => {
        this.dialog
          .open(FormBranchComponent, {
            width: '600px',
            data: { modo, branch: data },
          })
          .afterClosed()
          .subscribe((result) => {
            if (!result) return;

            const action =
              modo === 'create'
                ? this.branchService.crear(result)
                : this.branchService.actualizar(result);

            action.subscribe({
              next: () => {
                Swal.fire(
                  'Éxito',
                  modo === 'create'
                    ? 'La sucursal fue creada correctamente.'
                    : 'La sucursal fue actualizada correctamente.',
                  'success'
                );
                this.cargarSucursales();
              },
              error: (err) => {
                console.error('Error al guardar sucursal:', err);
                Swal.fire('Error', 'No se pudo guardar la sucursal.', 'error');
              },
            });
          });
      }
    );
  }

  /** ⚙️ Acciones centralizadas desde la tabla */
  handleAction(e: { action: string; element: any }) {
    const { action, element } = e;
    if (action === 'delete') this.eliminar(element.id || element.cityId);
    if (action === 'edit') this.abrirFormulario('edit', element);
  }
}
