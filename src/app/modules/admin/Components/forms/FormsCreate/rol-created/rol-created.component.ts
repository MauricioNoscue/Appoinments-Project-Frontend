import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolC, RolCreated, RolList } from '../../../../../../shared/Models/security/RolModel';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RolService } from '../../../../../../shared/services/rol.service';

@Component({
  selector: 'app-rol-created',
standalone:false,

  templateUrl: './rol-created.component.html',
  styleUrl: './rol-created.component.css'
})
export class RolCreatedComponent  {
constructor(private dialogRef: MatDialogRef<RolCreatedComponent>,private route: Router, private service : RolService) {}

  onFormSubmit(form: any) {

this.service.crear(form).subscribe(data=>{

  console.log(data)
 this.dialogRef.close(true);

})
    
   
  }
}
