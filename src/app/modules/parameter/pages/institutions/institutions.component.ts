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
    MatTooltipModule
  ],
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InstitutionsComponent implements OnInit {
  constructor(private dialog: MatDialog, private institutionService: InstitutionService) { }

  dataSource: InstitutionList[] = [];
  displayedColumns: string[] = ['index', 'name', 'nit', 'email', 'city', 'registrationDate', 'status', 'detail', 'actions'];
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
      }
    });
  }

  get filteredDataSource(): InstitutionList[] {
    return this.dataSource.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.nit.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  eliminar(id: number): void {
    const confirmado = confirm('¿Estás seguro de eliminar esta institución?');

    if (confirmado) {
      this.institutionService.eliminar(id).subscribe({
        next: () => {
          console.log('Institución eliminada exitosamente');
          this.cargarInstituciones(); // Recargar la lista
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  recargarListado(): void {
    this.cargarInstituciones();
  }

  abrirFormulario(modo: 'create' | 'edit', data?: Institution): void {
    console.log('Abrir formulario en modo:', modo, 'con datos:', data);
    
    // Importar dinámicamente el componente de formulario
    import('../../Components/forms/FormsBase/form-institution/form-institution.component').then(
      ({ FormInstitutionComponent }) => {
        const dialogRef = this.dialog.open(DialogContainerComponent, {
          width: '600px',
          data: {
            component: FormInstitutionComponent,
            payload: { modo, data }
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (modo === 'create') {
              this.institutionService.crear(result).subscribe(() => this.cargarInstituciones());
            } else {
              this.institutionService.actualizar(result).subscribe(() => this.cargarInstituciones());
            }
          }
        });
      }
    );
  }
}
