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

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css',
})
export class BranchComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private BranchService: BranchService
  ) {}

  dataSource: BranchList[] = [];
  displayedColumns: string[] = [
    'index',
    'name',
    'email',
    'phoneNumber',
    'address',
    'institutionName',
    'registrationDate',
    'status',
    'actions',
  ];
  searchTerm = '';

  ngOnInit(): void {
    this.cargarSucursales();
  }

  cargarSucursales(): void {
    this.BranchService.traerTodo().subscribe({
      next: (branches) => (this.dataSource = branches),
      error: (err) => console.error('Error al cargar sucursales:', err),
    });
  }

  get filteredDataSource(): BranchList[] {
    return this.dataSource.filter(
      (item) =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.institutionName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );
  }

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
        this.BranchService.eliminar(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminada',
              text: 'La sucursal fue eliminada correctamente.',
              confirmButtonText: 'OK',
              confirmButtonColor: '#28a745',
            });
            this.cargarSucursales(); // Recargar la lista
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la sucursal.',
              confirmButtonText: 'Cerrar',
            });
          },
        });
      }
    });
  }

  abrirFormulario(modo: 'create' | 'edit', data?: BranchList): void {
    import(
      '../../Components/forms/FormsBase/form-branch/form-branch.component'
    ).then(({ FormBranchComponent }) => {
      const dialogRef = this.dialog.open(FormBranchComponent, {
        width: '600px',
        data: { modo, branch: data }, // <- aquí viaja todo
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (!result) return;
        if (modo === 'create') {
          this.BranchService.crear(result).subscribe({
            next: (res) => {
              // Mostrar modal de éxito
              Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'La sucursal fue creada correctamente.',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#28a745',
              });
              this.cargarSucursales();
            },
            error: (err) => {
              console.error('Error al crear sucursal:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear la sucursal.',
                confirmButtonText: 'Cerrar',
              });
            },
          });
        } else {
          this.BranchService.actualizar(result).subscribe({
            next: (res) => {
              Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'La sucursal fue actualizada correctamente.',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#28a745',
              });
              this.cargarSucursales();
            },
            error: (err) => {
              console.error('Error al actualizar sucursal:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la sucursal.',
                confirmButtonText: 'Cerrar',
              });
            },
          });
        }
      });
    });
  }
}
