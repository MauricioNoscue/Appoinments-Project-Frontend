import { Component, Inject } from '@angular/core';
import { RolC, RolUpdated } from '../../../../../../shared/Models/security/RolModel';
import { MatDialogRef } from '@angular/material/dialog';
import { RolService } from '../../../../../../shared/services/rol.service';

@Component({
  selector: 'app-rol-edit',
  standalone: false,

  templateUrl: './rol-edit.component.html',
  styleUrl: './rol-edit.component.css',
})
export class RolEditComponent {
  rolData: RolUpdated;

  constructor(
    @Inject('MODAL_DATA') private data: any,
    private dialogRef: MatDialogRef<RolEditComponent>,
    private service: RolService
  ) {
    this.rolData = {
      id: data?.id,
      name: data?.name || '',
      description: data?.description || '',
    };
  }

  onFormSubmit(form: any) {
    const result = { ...form, id: this.rolData.id };
    this.service.actualizar(result).subscribe(() => this.dialogRef.close(true));
  }
}
