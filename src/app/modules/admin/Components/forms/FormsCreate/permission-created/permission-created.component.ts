import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PermissionService } from '../../../../../../shared/services/permission.service';

@Component({
  selector: 'app-pemission-created',
  standalone: true,
  templateUrl: './permission-created.component.html',
  styleUrl: './permission-created.component.css',
})
export class PermissionCreatedComponent {
  constructor(private dialogRef: MatDialogRef<PermissionCreatedComponent>) {}
  permissionServicio = inject(PermissionService);

  onFormSubmit(form: any) {
    console.log('Permission a create:', form);

    this.permissionServicio.crear(form).subscribe({
      next: (data) => { console.log('Permission creado:', data); },
      error: (error) => { console.error('Error al crear Permission:', error); }
    });



    // Aquí normalmente llamarías a un servicio para crear el permiso.
    // this.permissionService.create(form).subscribe(...)

    this.dialogRef.close(); // Cierra el modal
  }
}
