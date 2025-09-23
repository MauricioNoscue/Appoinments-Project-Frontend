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

@Component({
  selector: 'app-institutions',
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
  displayedColumns: string[] = [
    'index',
    'name',
    'nit',
    'email',
    'cityName',
    'registrationDate',
    'status',
    'actions',
  ];
  searchTerm: string = '';

  ngOnInit(): void {
    this.cargarInstituciones();
  }

  cargarInstituciones(): void {
    this.institutionService.traerTodo().subscribe({
      next: (institutions: InstitutionList[]) => {
        this.dataSource = institutions;
      },
      error: (err) => {
        console.error('Error al cargar instituciones:', err);
      },
    });
  }

  get filteredDataSource(): InstitutionList[] {
    return this.dataSource.filter(
      (item) =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.nit.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.cityName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  eliminar(id: number): void {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará la institucion permanentemente.',
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
              Swal.fire({
                icon: 'success',
                title: 'Eliminada',
                text: 'La institucion fue eliminada correctamente.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#28a745',
              });
              this.cargarInstituciones(); // Recargar la lista
            },
            error: (err) => {
              console.error('Error al eliminar:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la institucion.',
                confirmButtonText: 'Cerrar',
              });
            },
          });
        }
      });
    }
  recargarListado(): void {
    this.cargarInstituciones();
  }

  abrirFormulario(modo: 'create' | 'edit', data?: Institution): void {
    console.log('Abrir formulario en modo:', modo, 'con datos:', data);

    import(
      '../../Components/forms/FormsBase/form-institution/form-institution.component'
    ).then(({ FormInstitutionComponent }) => {
      const dialogRef = this.dialog.open(FormInstitutionComponent, {
        width: '600px',
        data: { modo, data }, // viaja por MAT_DIALOG_DATA
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (!result) return;
         if (modo === 'create') {
                  this.institutionService.crear(result).subscribe({
                    next: (res) => {
                      // Mostrar modal de éxito
                      Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'La institucion fue creada correctamente.',
                        confirmButtonText: 'Continuar',
                        confirmButtonColor: '#28a745',
                      });
                      this.cargarInstituciones();
                    },
                    error: (err) => {
                      console.error('Error al crear institucion:', err);
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo crear la institucion.',
                        confirmButtonText: 'Cerrar',
                      });
                    },
                  });
                } else {
                  this.institutionService.actualizar(result).subscribe({
                    next: (res) => {
                      Swal.fire({
                        icon: 'success',
                        title: '¡Actualizado!',
                        text: 'La institucion fue actualizada correctamente.',
                        confirmButtonText: 'Continuar',
                        confirmButtonColor: '#28a745',
                      });
                      this.cargarInstituciones();
                    },
                    error: (err) => {
                      console.error('Error al actualizar institucion:', err);
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo actualizar la institucion.',
                        confirmButtonText: 'Cerrar',
                      });
                    },
                  });
                }
              });
            });
          }
        }
