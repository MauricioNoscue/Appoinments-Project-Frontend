import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from '../../../../../shared/services/permission.service';
import {
  PermissionList,
  PermissionC,
} from '../../../../../shared/Models/security/permission';
import { FormPermissionComponent } from '../../../Components/forms/FormsBase/form-permission/form-permission.component';

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
  searchTerm = '';

  ngOnInit(): void {
    this.cargarPermisos();
  }

  get filteredDataSource(): PermissionList[] {
    return this.dataSource.filter((item) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  cargarPermisos(): void {
    this.service.traerTodo().subscribe({
      next: (permisos) => (this.dataSource = permisos),
      error: (err) => console.error('Error al cargar permisos:', err),
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este permiso?')) return;
    this.service.eliminar(id).subscribe({
      next: () => this.cargarPermisos(),
      error: (err) => console.error('Error al eliminar:', err),
    });
  }

  abrirDialog(modo: 'create' | 'edit', data?: PermissionC): void {
    this.dialog
      .open(FormPermissionComponent, {
        width: '600px',
        data: { modo, data }, // MAT_DIALOG_DATA
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        if (modo === 'create') {
          this.service.crear(result).subscribe(() => this.cargarPermisos());
        } else {
          this.service
            .actualizar(result)
            .subscribe(() => this.cargarPermisos());
        }
      });
  }
}
