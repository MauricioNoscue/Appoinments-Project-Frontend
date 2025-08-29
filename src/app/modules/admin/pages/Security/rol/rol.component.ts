import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RolService } from '../../../../../shared/services/rol.service';
import { RolC, RolCreated, RolList } from '../../../../../shared/Models/security/RolModel';
import { MatDialog } from '@angular/material/dialog';

import { FormRolComponent } from '../../../Components/forms/FormsBase/form-rol/form-rol.component';
@Component({
  selector: 'app-rol',
  standalone: false,
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css',
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
      error: (err) => console.error('Error al cargar roles:', err),
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
        this.service.crear(result).subscribe(() => this.cargarRoles());
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
          this.service.crear(result).subscribe(() => this.cargarRoles());
        } else {
          this.service.actualizar(result).subscribe(() => this.cargarRoles());
        }
      });
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este permiso?')) return;
    this.service.eliminar(id).subscribe({
      next: () => this.cargarRoles(),
      error: (err) => console.error('Error al eliminar:', err),
    });
  }
}
