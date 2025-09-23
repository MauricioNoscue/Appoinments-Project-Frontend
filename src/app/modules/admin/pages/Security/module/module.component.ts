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

// Abrimos el form standalone directo
import { FormModuleComponent } from '../../../Components/forms/FormsBase/form-module/form-module.component';

@Component({
  selector: 'app-module',
  standalone: false,
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css'],
})
export class ModuleComponent implements OnInit {
  constructor(private service: ModuleService, private dialog: MatDialog) {}

  dataSource: ModuleList[] = [];
  displayedColumns: string[] = [
    'index',
    'name',
    'description',
    'status',
    'detail',
    'actions',
  ];

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

  // ====== Crear ======
  abrirCrear(): void {
    this.dialog
      .open(FormModuleComponent, {
        width: '600px',
        data: { modo: 'create' as const }, // el form sabe qué hacer
      })
      .afterClosed()
      .subscribe((result: ModuleCreated | undefined) => {
        if (!result) return;

        this.service.crear(result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Creado!',
              text: 'El módulo fue creado correctamente.',
              confirmButtonText: 'Continuar',
              confirmButtonColor: '#28a745',
            });
            this.cargarModules();
          },
          error: (err) => {
            console.error('Error al crear módulo:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el módulo.',
              confirmButtonText: 'Cerrar',
            });
          },
        });
      });
  }

  abrirDialog(modo: 'create' | 'edit', data?: ModuleC): void {
    this.dialog
      .open(FormModuleComponent, {
        width: '600px',
        data: { modo, data }, // MAT_DIALOG_DATA
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;

        if (modo === 'create') {
          this.service.crear(result).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: '¡Creado!',
                text: 'El módulo fue creado correctamente.',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#28a745',
              });
              this.cargarModules();
            },
            error: (err) => {
              console.error('Error al crear módulo:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear el módulo.',
                confirmButtonText: 'Cerrar',
              });
            },
          });
        } else {
          // edit
          this.service.actualizar(result as ModuleEdid).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'El módulo fue actualizado correctamente.',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#28a745',
              });
              this.cargarModules();
            },
            error: (err) => {
              console.error('Error al actualizar módulo:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el módulo.',
                confirmButtonText: 'Cerrar',
              });
            },
          });
        }
      });
  }

  // ====== Eliminar ======
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
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El módulo fue eliminado correctamente.',
              confirmButtonText: 'OK',
            });
            this.cargarModules();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el módulo.',
              confirmButtonText: 'Cerrar',
            });
          },
        });
      }
    });
  }
}
