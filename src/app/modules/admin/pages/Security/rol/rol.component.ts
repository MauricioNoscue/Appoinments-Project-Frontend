import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { RolService } from '../../../../../shared/services/rol.service';
import {
  RolC,
  RolCreated,
  RolList,
} from '../../../../../shared/Models/security/RolModel';
import { FormRolComponent } from '../../../Components/forms/FormsBase/form-rol/form-rol.component';
import { ColumnDefinition } from '../../../../../shared/Models/Tables/TableModels';

@Component({
  selector: 'app-rol',
  standalone: false,
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css'], // corregido a styleUrls
})
export class RolComponent implements OnInit {
  constructor(private service: RolService, private dialog: MatDialog) {}

  dataSource: RolList[] = [];
  dataSourceFiltered: RolList[] = [];
  searchTerm = '';

  // 🔹 Definición de columnas reutilizables
  columnDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'text' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    {
      key: 'status',
      label: 'Estado',
      type: 'chip',
      colorFn: (x) => (x.status ? 'warn' : 'primary'),
      format: (x) => (x.status ? 'Inactivo' : 'Activo'),
    },
    { key: 'detail', label: 'Detalle', type: 'icon', icon: 'info', tooltip: 'Ver detalle' },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  displayedColumns: string[] = this.columnDefs.map((c) => c.key);

  ngOnInit(): void {
    this.cargarRoles();
  }

  /** 🔄 Cargar roles */
  cargarRoles(): void {
    this.service.traerTodo().subscribe({
      next: (roles) => 
        {
          this.dataSource = roles;
          this.dataSourceFiltered = [...this.dataSource];
        },
      error: (err) => {
        console.error('Error al cargar roles:', err);
        Swal.fire('Error', 'No se pudieron cargar los roles.', 'error');
      },
    });
  }

  /** 🔍 Filtro local */
  get filteredDataSource(): RolList[] {
    const q = this.searchTerm.toLowerCase().trim();
    return this.dataSource.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q)
    );
  }

  /** 🧾 Crear o editar */
  abrirDialog(modo: 'create' | 'edit', data?: RolC): void {
    this.dialog
      .open(FormRolComponent, {
        width: '600px',
        data: { modo, data },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;

        const action =
          modo === 'create'
            ? this.service.crear(result)
            : this.service.actualizar(result);

        action.subscribe({
          next: () => {
            const mensaje =
              modo === 'create'
                ? 'El rol fue creado correctamente.'
                : 'El rol fue actualizado correctamente.';
            Swal.fire('Éxito', mensaje, 'success');
            this.cargarRoles();
          },
          error: (err) => {
            console.error('Error al guardar:', err);
            Swal.fire('Error', 'No se pudo guardar el rol.', 'error');
          },
        });
      });
  }

  /** 🗑️ Eliminar */
  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el rol permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Rol eliminado correctamente.', 'success');
            this.cargarRoles();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el rol.', 'error');
          },
        });
      }
    });
  }

  /** ⚙️ Acciones emitidas desde la tabla genérica */
  handleAction(e: { action: string; element: any }) {
    const { action, element } = e;
    if (action === 'delete') this.eliminar(element.id);
    if (action === 'edit') this.abrirDialog('edit', element);
    if (action === 'detail') Swal.fire('Detalle', `Rol: ${element.name}`, 'info');
  }
}