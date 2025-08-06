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
import { CityList, City } from "../../../../shared/Models/parameter/CityModel";
import { CityService } from "../../../../shared/services/city.service";

@Component({
  selector: 'app-city',
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
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CityComponent implements OnInit {
  constructor(private dialog: MatDialog, private cityService: CityService) { }

  dataSource: CityList[] = [];
  displayedColumns: string[] = ['index', 'name', 'departament', 'registrationDate', 'status', 'detail', 'actions'];
  searchTerm: string = '';

  ngOnInit(): void {
    this.cargarCiudades();
  }

  cargarCiudades(): void {
    this.cityService.traerTodo().subscribe({
      next: (cities: CityList[]) => {
        this.dataSource = cities;
      },
      error: (err) => {
        console.error('Error al cargar ciudades:', err);
      }
    });
  }

  get filteredDataSource(): CityList[] {
    return this.dataSource.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.departamentName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  eliminar(id: number): void {
    const confirmado = confirm('¿Estás seguro de eliminar esta ciudad?');

    if (confirmado) {
      this.cityService.eliminar(id).subscribe({
        next: () => {
          console.log('Ciudad eliminada exitosamente');
          this.cargarCiudades(); // Recargar la lista
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  recargarListado(): void {
    this.cargarCiudades();
  }

  abrirFormulario(modo: 'create' | 'edit', data?: City): void {
    console.log('Abrir formulario en modo:', modo, 'con datos:', data);
    
    // Importar dinámicamente el componente de formulario
    import('../../Components/forms/FormsBase/form-city/form-city.component').then(
      ({ FormCityComponent }) => {
        const dialogRef = this.dialog.open(DialogContainerComponent, {
          width: '600px',
          data: {
            component: FormCityComponent,
            payload: { modo, data }
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (modo === 'create') {
              this.cityService.crear(result).subscribe(() => this.cargarCiudades());
            } else {
              this.cityService.actualizar(result).subscribe(() => this.cargarCiudades());
            }
          }
        });
      }
    );
  }
}
