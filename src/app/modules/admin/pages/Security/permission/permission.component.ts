import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { PermissionService } from '../../../../../shared/services/permission.service';
import {
  PermissionList,
  PermissionC,
} from '../../../../../shared/Models/security/permission';
import { FormPermissionComponent } from '../../../Components/forms/FormsBase/form-permission/form-permission.component';

@Component({
  selector: 'app-permission',
  standalone: false,
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PermissionComponent implements OnInit {
  constructor(private service: PermissionService, private dialog: MatDialog) {}

  dataSource: PermissionList[] = [];
  searchTerm = '';

  /* PALETA: colores elegidos para los círculos.
     Puedes poner los colores que quieras. */
  private palette: string[] = [
    '#2D7DF6', // azul
    '#F59E0B', // amarillo/ámbar
    '#10B981', // verde
    '#EF4444', // rojo
    '#8B5CF6', // morado
    '#06B6D4', // cyan
    '#F97316', // naranja
    '#0EA5A4', // teal
    '#6366F1', // indigo claro
    '#EC4899', // rosa
  ];

  ngOnInit(): void {
    this.cargarPermisos();
  }

  get filteredDataSource(): PermissionList[] {
    return this.dataSource.filter((item) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  cargarPermisos(): void {
    this.service.traerTodo().subscribe({
      next: (permisos) => {
        this.dataSource = permisos || [];
        // No es necesario mapear colores aquí si usamos colorFromString() al render,
        // pero si quieres preparar algo extra lo puedes hacer.
      },
      error: (err) => {
        console.error('Error al cargar permisos:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los permisos.',
          confirmButtonText: 'Cerrar',
        });
      },
    });
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el permiso permanentemente.',
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
              text: 'El permiso fue eliminado correctamente.',
              confirmButtonText: 'OK',
            });
            this.cargarPermisos();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el permiso.',
              confirmButtonText: 'Cerrar',
            });
          },
        });
      }
    });
  }

  abrirDialog(modo: 'create' | 'edit', data?: PermissionC): void {
    this.dialog
      .open(FormPermissionComponent, {
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
                text: 'El permiso fue creado correctamente.',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#28a745',
              });
              // recargar lista (los nuevos elementos recibirán color por getColor)
              this.cargarPermisos();
            },
            error: (err) => {
              console.error('Error al crear permiso:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear el permiso.',
                confirmButtonText: 'Cerrar',
              });
            },
          });
        } else {
          // edit
          this.service.actualizar(result).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'El permiso fue actualizado correctamente.',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#28a745',
              });
              this.cargarPermisos();
            },
            error: (err) => {
              console.error('Error al actualizar permiso:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el permiso.',
                confirmButtonText: 'Cerrar',
              });
            },
          });
        }
      });
  }

  /**
   * getColor(item): Devuelve un color para el elemento.
   * Usa preferiblemente el id si está disponible (estable entre recargas).
   * Si no hay id, usa el nombre.
   */
  getColor(item: PermissionList): string {
    // si el item tiene id numérico y quieres más estabilidad entre recargas,
    // úsalo para calcular el color. Si no existe, usa el name.
    const key = (item as any).id ?? item.name;
    return this.colorFromString(String(key));
  }

  /**
   * colorFromString: función determinística que genera un índice en la paleta
   * a partir de un texto (id o nombre). Esto evita que los colores cambien de forma aleatoria
   * cada vez que recargas la lista.
   */
  private colorFromString(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0; // convertir a 32-bit int
    }
    const index = Math.abs(hash) % this.palette.length;
    return this.palette[index];
  }
}
