import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import {
  ModuleList,
  ModuleCreated,
  ModuleEdid,
  ModuleC,
} from '../../../../../shared/Models/security/moduleModel';
import { ModuleService } from '../../../../../shared/services/module.service';

// Abrimos el form standalone directo
import { FormModuleComponent } from '../../../Components/forms/FormsBase/form-module/form-module.component';


@Component({
  selector: 'app-module',
  standalone: false,
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css'],
})
export class ModuleComponent implements OnInit {
  constructor(private service: ModuleService, private dialog: MatDialog) {}

  dataSource: ModuleList[] = [];
  displayedColumns: string[] = [
    'index',
    'name',
    'description',
    'status',
    'detail',
    'actions',
  ];

  ngOnInit(): void {
    this.cargarModules();
  }

  cargarModules(): void {
    this.service.traerTodo().subscribe({
      next: (modules) => (this.dataSource = modules),
      error: (err) => console.error('Error al cargar módulos:', err),
    });
  }

  // ====== Crear ======
  abrirCrear(): void {
    this.dialog
      .open(FormModuleComponent, {
        width: '600px',
        data: { modo: 'create' as const }, // el form sabe qué hacer
      })
      .afterClosed()
      .subscribe((result: ModuleCreated | undefined) => {
        if (!result) return;
        this.service.crear(result).subscribe(() => this.cargarModules());
      });
  }

  abrirDialog(modo: 'create' | 'edit', data?: ModuleC): void {
    this.dialog
      .open(FormModuleComponent, {
        width: '600px',
        data: { modo, data }, // MAT_DIALOG_DATA
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        if (modo === 'create') {
          this.service.crear(result).subscribe(() => this.cargarModules());
        } else {
          this.service.actualizar(result).subscribe(() => this.cargarModules());
        }
      });
  }

  // ====== Eliminar ======
  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este permiso?')) return;
    this.service.eliminar(id).subscribe({
      next: () => this.cargarModules(),
      error: (err) => console.error('Error al eliminar:', err),
    });
  }
}
