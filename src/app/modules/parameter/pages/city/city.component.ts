import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';

import { DialogContainerComponent } from '../../../../shared/components/Modal/dialog-container/dialog-container.component';
import { CityList, City } from '../../../../shared/Models/parameter/CityModel';
import { CityService } from '../../../../shared/services/city.service';
import { ColumnDefinition } from '../../../../shared/Models/Tables/TableModels';
import { SharedModule } from "../../../../shared/shared.module";

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
    MatTooltipModule,
    SharedModule
],
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css'],
})
export class CityComponent implements OnInit {
  constructor(private dialog: MatDialog, private cityService: CityService) {}

  dataSource: CityList[] = [];
  datasourceFiltered: CityList[] = [];
  searchTerm = '';

  // 🔹 Definición de columnas genéricas
  columnDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'text' },
    { key: 'name', label: 'Nombre' },
    { key: 'departamentName', label: 'Departamento' },
    {
      key: 'registrationDate',
      label: 'Fecha Registro',
      type: 'text',
      format: (x) =>
        x.registrationDate
          ? new Date(x.registrationDate).toLocaleDateString('es-CO')
          : '',
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'chip',
      colorFn: (x) => (x.isDeleted ? 'warn' : 'primary'),
      format: (x) => (x.isDeleted ? 'Inactivo' : 'Activo'),
    },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  displayedColumns: string[] = this.columnDefs.map((c) => c.key);

  ngOnInit(): void {
    this.cargarCiudades();
  }

  /** 🔄 Cargar listado */
  cargarCiudades(): void {
    this.cityService.traerTodo().subscribe({
      next: (cities) => 
        {
          this.dataSource = cities;
          this.datasourceFiltered = [...this.dataSource];
        },
      error: (err) => {
        console.error('Error al cargar ciudades:', err);
        Swal.fire('Error', 'No se pudieron cargar las ciudades.', 'error');
      },
    });
  }

  /** 🔍 Filtro local */
  get filteredDataSource(): CityList[] {
    const q = this.searchTerm.toLowerCase().trim();
    return this.dataSource.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.departamentName ?? '').toLowerCase().includes(q)
    );
  }

  /** 🗑️ Eliminar ciudad */
  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la ciudad permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cityService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'Ciudad eliminada correctamente.', 'success');
            this.cargarCiudades();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar la ciudad.', 'error');
          },
        });
      }
    });
  }

  /** ➕ Crear / ✏️ Editar ciudad */
  abrirFormulario(modo: 'create' | 'edit', data?: City): void {
    import('../../Components/forms/FormsBase/form-city/form-city.component').then(
      ({ FormCityComponent }) => {
        this.dialog
          .open(FormCityComponent, {
            width: '600px',
            data: { modo, data },
          })
          .afterClosed()
          .subscribe((result) => {
            if (!result) return;

            const action =
              modo === 'create'
                ? this.cityService.crear(result)
                : this.cityService.actualizar(result);

            action.subscribe({
              next: () => {
                Swal.fire(
                  'Éxito',
                  modo === 'create'
                    ? 'La ciudad fue creada correctamente.'
                    : 'La ciudad fue actualizada correctamente.',
                  'success'
                );
                this.cargarCiudades();
              },
              error: (err) => {
                console.error('Error al guardar ciudad:', err);
                Swal.fire('Error', 'No se pudo guardar la ciudad.', 'error');
              },
            });
          });
      }
    );
  }

  /** ⚙️ Acciones emitidas por la tabla genérica */
  handleAction(e: { action: string; element: any }) {
    const { action, element } = e;
    if (action === 'delete') this.eliminar(element.id || element.cityId);
    if (action === 'edit') this.abrirFormulario('edit', element);
  }}
