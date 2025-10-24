import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import {
  ModuleList,
  ModuleCreated,
  ModuleEdid,
  ModuleC,
} from '../../../../../shared/Models/security/moduleModel';
import { ModuleService } from '../../../../../shared/services/module.service';

import { FormModuleComponent } from '../../../Components/forms/FormsBase/form-module/form-module.component';
import { ColumnDefinition } from '../../../../../shared/Models/Tables/TableModels';

@Component({
  selector: 'app-module',
  standalone: false,
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css'],
})
export class ModuleComponent implements OnInit {
  constructor(private service: ModuleService, private dialog: MatDialog) {}

  dataSource: ModuleList[] = [];
  searchTerm = '';

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
    this.cargarModules();
  }

  cargarModules(): void {
    this.service.traerTodo().subscribe({
      next: (modules) => (this.dataSource = modules),
      error: (err) => {
        console.error('Error al cargar módulos:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los módulos.',
          confirmButtonText: 'Cerrar',
        });
      },
    });
  }

  get filteredDataSource(): ModuleList[] {
    const q = this.searchTerm.toLowerCase().trim();
    return this.dataSource.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.description ?? '').toLowerCase().includes(q)
    );
  }

  abrirDialog(modo: 'create' | 'edit', data?: ModuleC): void {
    this.dialog
      .open(FormModuleComponent, {
        width: '600px',
        data: { modo, data },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;

        const accion =
          modo === 'create'
            ? this.service.crear(result)
            : this.service.actualizar(result as ModuleEdid);

        accion.subscribe({
          next: () => {
            const texto =
              modo === 'create'
                ? 'El módulo fue creado correctamente.'
                : 'El módulo fue actualizado correctamente.';
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: texto,
              confirmButtonColor: '#28a745',
            });
            this.cargarModules();
          },
          error: (err) => {
            console.error('Error al guardar módulo:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo guardar el módulo.',
              confirmButtonText: 'Cerrar',
            });
          },
        });
      });
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el módulo permanentemente.',
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
            Swal.fire('Eliminado', 'El módulo fue eliminado correctamente.', 'success');
            this.cargarModules();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el módulo.', 'error');
          },
        });
      }
    });
  }

  handleAction(e: { action: string; element: any }) {
    const { action, element } = e;
    if (action === 'delete') this.eliminar(element.id);
    if (action === 'edit') this.abrirDialog('edit', element);
    if (action === 'detail') Swal.fire('Detalle', `Módulo: ${element.name}`, 'info');
  }
}
