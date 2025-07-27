import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolC, RolList } from '../../../../../../shared/Models/security/RolModel';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rol-created',
standalone:false,

  templateUrl: './rol-created.component.html',
  styleUrl: './rol-created.component.css'
})
export class RolCreatedComponent  {
constructor(private dialogRef: MatDialogRef<RolCreatedComponent>) {}

  onFormSubmit(form: any) {
    console.log('Rol a crear:', form);

    // Aquí haces luego:
    // this.rolService.crear(form).subscribe(...)

    this.dialogRef.close(); // Cierra el modal
  }
}
