

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContainerComponent } from '../../../../../shared/components/Modal/dialog-container/dialog-container.component';
import { PermissionService } from '../../../../../shared/services/permission.service';
import {PermissionList,PermissionC,} from '../../../../../shared/Models/security/permission';
import { FormPermissionComponent } from '../../../Components/forms/FormsBase/form-permission/form-permission.component'

@Component({
  selector: 'app-permission',
  standalone: false,
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PermissionComponent implements OnInit {
  constructor(private service: PermissionService, private dialog: MatDialog) {}

  dataSource: PermissionList[] = [];
  displayed: string[] = [
    'name',
    'description',
    'actions',
  ];
  searchTerm: string = '';

  ngOnInit(): void {
    // this.cargarPermisos();
    this.service.traerTodo().subscribe((permission) => {
      this.dataSource = permission;
    });
  }

  get filteredDataSource(): PermissionList[] {
    return this.dataSource.filter((item) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  eliminar(id: number): void {
    const confirmado = confirm('¿Estás seguro de eliminar este permiso?');

    if (confirmado) {
      this.service.eliminar(id).subscribe({
        next: () => this.cargarPermisos(),
        error: (err) => console.error('Error al eliminar:', err),
      });
    }
  }

  cargarPermisos(): void {
    this.service.traerTodo().subscribe({
      next: (permisos: PermissionList[]) => {
        this.dataSource = permisos;
      },
      error: (err) => {
        console.error('Error al cargar permisos:', err);
      },
    });

  }

  abrirDialog(modo: 'create' | 'edit', data?: PermissionC): void {
    const dialogRef = this.dialog.open(DialogContainerComponent, {
      width: '600px',
      data: {
        component: FormPermissionComponent, // <-- Ajusta si usas otro componente
        payload: { modo, data },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (modo === 'create') {
          this.service.crear(result).subscribe(() => this.cargarPermisos());
        } else {
          this.service
            .actualizar(result)
            .subscribe(() => this.cargarPermisos());
        }
      }
    });
  }
}
