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

@Component({
  selector: 'app-rol',
  standalone: false,
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css'], // corregido a styleUrls
})
export class RolComponent implements OnInit {
  constructor(private service: RolService, private dialog: MatDialog) {}

  dataSource: RolList[] = [];
  displayedColumns: string[] = [
    'index',
    'name',
    'description',
    'status',
    'detail',
    'actions',
  ];

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.service.traerTodo().subscribe({
      next: (roles) => (this.dataSource = roles),
      error: (err) => {
        console.error('Error al cargar roles:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los roles.',
          confirmButtonText: 'Cerrar',
        });
      },
    });
  }

  abrirCrear(): void {
    this.dialog
      .open(FormRolComponent, {
        width: '600px',
        data: { modo: 'create' as const }, // el form sabe qué hacer
      })
      .afterClosed()
      .subscribe((result: RolCreated | undefined) => {
        if (!result) return;

        this.service.crear(result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Creado!',
              text: 'El rol fue creado correctamente.',
              confirmButtonText: 'Continuar',
              confirmButtonColor: '#28a745',
            });
            this.cargarRoles();
          },
          error: (err) => {
            console.error('Error al crear rol:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el rol.',
              confirmButtonText: 'Cerrar',
            });
          },
        });
      });
  }

  abrirDialog(modo: 'create' | 'edit', data?: RolC): void {
    this.dialog
      .open(FormRolComponent, {
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
                text: 'El rol fue creado correctamente.',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#28a745',
              });
              this.cargarRoles();
            },
            error: (err) => {
              console.error('Error al crear rol:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear el rol.',
                confirmButtonText: 'Cerrar',
              });
            },
          });
        } else {
          // editar
          this.service.actualizar(result).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'El rol fue actualizado correctamente.',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#28a745',
              });
              this.cargarRoles();
            },
            error: (err) => {
              console.error('Error al actualizar rol:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el rol.',
                confirmButtonText: 'Cerrar',
              });
            },
          });
        }
      });
  }

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
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El rol fue eliminado correctamente.',
              confirmButtonText: 'OK',
            });
            this.cargarRoles();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el rol.',
              confirmButtonText: 'Cerrar',
            });
          },
        });
      }
    });
  }
}
