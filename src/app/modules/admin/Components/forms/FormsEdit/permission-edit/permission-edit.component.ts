import { Component, Inject } from '@angular/core';
import { PermissionC } from '../../../../../../shared/Models/security/permission';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-permission-edit',
  standalone: false,
  templateUrl: './permission-edit.component.html',
  styleUrl: './permission-edit.component.css',
})
export class PermissionEditComponent {
  permissionData: PermissionC;

  constructor(
    @Inject('MODAL_DATA') private data: any,
    private dialogRef: MatDialogRef<PermissionEditComponent>
  ) {
    this.permissionData = {
      id: data?.id,
      name: data?.name || '',
      description: data?.description || '',
    };
  }
  onFormSubmit(form: any) {
    const result = {
      ...form,
      id: this.data?.id,
    };

    console.log('Datos a editar:', result);
    this.dialogRef.close(result);
  }
}
