// import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { PermissionService } from '../../../../../shared/services/permission.service';
// import { MatDialog } from '@angular/material/dialog';
// import { DialogContainerComponent } from '../../../../../shared/components/Modal/dialog-container/dialog-container.component';
// import { PermissionCreatedComponent } from '../../../Components/forms/FormsCreate/permission-created/permission-created.component';
// import { PermissionList } from '../../../../../shared/Models/security/permission';
// import { PermissionEditComponent } from '../../../Components/forms/FormsEdit/permission-edit/permission-edit.component';

// @Component({
//   selector: 'app-permission',
//   standalone: false,
//   templateUrl: './permission.component.html',
//   styleUrl: './permission.component.css',
//   encapsulation: ViewEncapsulation.None,
// })
// export class PermissionComponent implements OnInit {
//   constructor(private service: PermissionService, private dialog: MatDialog) {}

//   abrirDialog(tipo: 'create' | 'edit', datos?: any) {
//     const componentMap = {
//       create: PermissionCreatedComponent,
//       edit: PermissionEditComponent,
//     };

//     this.dialog.open(DialogContainerComponent, {
//       width: '600px',
//       data: {
//         component: componentMap[tipo],
//         payload: datos,
//       },
//     });
//   }

//   dataSource: PermissionList[] = [];

//   ngOnInit(): void {
//     this.service.traerTodo().subscribe((permission) => {
//       console.log('Permisos obtenidos: ', permission);
//       this.dataSource = permission;
//     });
//   }

//   displayedColumns: string[] = [
//     'index',
//     'name',
//     'description',
//     'status',
//     'detail',
//     'actions',
//   ];
//   searchTerm: string = '';

//   eliminar(id: number) {
//     console.log('id a eliminar  ', id);
//   }

//   getRoleClass(roleName: string): string {
//     const lower = roleName.toLowerCase();
//     if (lower.includes('admin')) return 'admin';
//     if (lower.includes('doctor')) return 'doctor';
//     if (lower.includes('paciente') || lower.includes('patient'))
//       return 'patient';
//     return 'default-role'; // clase por defecto
//   }
// }


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
  displayedColumns: string[] = [
    'index',
    'name',
    'description',
    'status',
    'detail',
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
      item.permission.name.toLowerCase().includes(this.searchTerm.toLowerCase())
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
    // this.service.traerTodo().subscribe((data) => {
    //   console.log('Permisos obtenidos: ', data);
    //   this.dataSource = data;
    // });
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
