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


@Component({
  selector: 'app-departament',
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
  templateUrl: './departament.component.html',
  styleUrl: './departament.component.css',
})
export class DepartamentComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private departamentService: DepartamentService
  ) {}

  dataSource: DepartamentList[] = [];
  displayedColumns: string[] = [
    'index',
    'name',
    'registrationDate',
    'status',
    'actions',
  ];
  searchTerm: string = '';

  ngOnInit(): void {
    this.cargarDepartamentos();
    console.log('¿Data cargada?', this.dataSource); // async
  }

  cargarDepartamentos(): void {
    this.departamentService.traerTodo().subscribe({
      next: (departamentos: DepartamentList[]) => {
        this.dataSource = departamentos;
        console.log('Departamentos cargados:', departamentos);
      },
      error: (err) => {
        console.error('Error al cargar departamentos:', err);
      },
    });
  }

  get filteredDataSource(): DepartamentList[] {
    return this.dataSource.filter((item) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

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
             Swal.fire({
               icon: 'success',
               title: 'Eliminada',
               text: 'El departamento fue eliminada correctamente.',
               confirmButtonText: 'OK',
               confirmButtonColor: '#28a745',
             });
             this.cargarDepartamentos(); // Recargar la lista
           },
           error: (err) => {
             console.error('Error al eliminar:', err);
             Swal.fire({
               icon: 'error',
               title: 'Error',
               text: 'No se pudo eliminar la ciudad.',
               confirmButtonText: 'Cerrar',
             });
           },
         });
       }
     });
   }

  recargarListado(): void {
    this.cargarDepartamentos();
  }

  abrirFormulario(modo: 'create' | 'edit', data?: DepartamentList): void {
    import(
      '../../Components/forms/FormsBase/form-departament/form-departament.component'
    ).then(({ FormDepartamentComponent }) => {
      const dialogRef = this.dialog.open(FormDepartamentComponent, {
        width: '600px',
        data: { modo, data }, // viaja por MAT_DIALOG_DATA
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (!result) return;

        if (modo === 'create') {
                 this.departamentService.crear(result).subscribe({
                   next: (res) => {
                     // Mostrar modal de éxito
                     Swal.fire({
                       icon: 'success',
                       title: '¡Éxito!',
                       text: 'El departamaneto fue creada correctamente.',
                       confirmButtonText: 'Continuar',
                       confirmButtonColor: '#28a745',
                     });
                     this.cargarDepartamentos();
                   },
                   error: (err) => {
                     console.error('Error al crear departamento:', err);
                     Swal.fire({
                       icon: 'error',
                       title: 'Error',
                       text: 'No se pudo crear el departamento.',
                       confirmButtonText: 'Cerrar',
                     });
                   },
                 });
               } else {
                 this.departamentService.actualizar(result).subscribe({
                   next: (res) => {
                     Swal.fire({
                       icon: 'success',
                       title: '¡Actualizado!',
                       text: 'El departamento fue actualizado correctamente.',
                       confirmButtonText: 'Continuar',
                       confirmButtonColor: '#28a745',
                     });
                     this.cargarDepartamentos();
                   },
                   error: (err) => {
                     console.error('Error al actualizar departamento:', err);
                     Swal.fire({
                       icon: 'error',
                       title: 'Error',
                       text: 'No se pudo actualizar el departamento.',
                       confirmButtonText: 'Cerrar',
                     });
                   },
                 });
               }
             });
           });
         }
       }
