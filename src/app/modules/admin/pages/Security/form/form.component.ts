import { Component, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']

})
export class FormComponent {
  displayedColumns: string[] = ['index', 'name', 'url', 'description', 'status', 'detail', 'actions'];
  searchTerm: string = '';

get filteredDataSource() {
  return this.dataSource.data.filter((item: { name: string; url: string; description: string; status: string }) =>
    item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}
  dataSource = new MatTableDataSource([
    {
      name: 'Formulario de citas',
      url: '/form/citas',
      description: 'Módulo para agendar citas médicas',
      status: 'Activo',
    },
    {
      name: 'Formulario de usuarios',
      url: '/form/usuarios',
      description: 'Gestión de usuarios internos',
      status: 'Inactivo',
    },
    {
      name: 'Formulario de usuarios',
      url: '/form/usuarios',
      description: 'Gestión de usuarios internos',
      status: 'Inactivo',
    },
    {
      name: 'Formulario de usuarios',
      url: '/form/usuarios',
      description: 'Gestión de usuarios internos',
      status: 'Inactivo',
    },
    {
      name: 'Formulario de usuarios',
      url: '/form/usuarios',
      description: 'Gestión de usuarios internos',
      status: 'Inactivo',
    },
    {
      name: 'Formulario de usuarios',
      url: '/form/usuarios',
      description: 'Gestión de usuarios internos',
      status: 'Inactivo',
    },
    {
      name: 'Formulario de usuarios',
      url: '/form/usuarios',
      description: 'Gestión de usuarios internos',
      status: 'Inactivo',
    },
    {
      name: 'Formulario de usuarios',
      url: '/form/usuarios',
      description: 'Gestión de usuarios internos',
      status: 'Inactivo',
    },
    {
      name: 'Formulario de usuarios',
      url: '/form/usuarios',
      description: 'Gestión de usuarios internos',
      status: 'Inactivo',
    },
    {
      name: 'Formulario de usuarios',
      url: '/form/usuarios',
      description: 'Gestión de usuarios internos',
      status: 'Inactivo',
    },
    {
      name: 'Formulario de usuarios',
      url: '/form/usuarios',
      description: 'Gestión de usuarios internos',
      status: 'Inactivo',
    },
  ]);
}
