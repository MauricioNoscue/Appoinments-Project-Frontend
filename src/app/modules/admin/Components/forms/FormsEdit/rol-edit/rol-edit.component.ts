import { Component, Inject } from '@angular/core';
import { RolC } from '../../../../../../shared/Models/security/RolModel';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rol-edit',
standalone:false,

  templateUrl: './rol-edit.component.html',
  styleUrl: './rol-edit.component.css'
})
export class RolEditComponent {

 rolData: RolC;

  constructor(
  @Inject('MODAL_DATA') private data: any,
  private dialogRef: MatDialogRef<RolEditComponent>
) {
  this.rolData = {
    id: data?.id,
    nombre: data?.name || '',
    descripcion: data?.description || '',
    permisos: data?.permisos || []
  };
}
onFormSubmit(form: any) {
  const result = {
    ...form,
    id: this.data?.id
  };

  console.log('Datos a editar:', result);
  this.dialogRef.close(result);
}

}
