import { Component, Inject } from '@angular/core';
import { ModuleEdid } from '../../../../../../shared/Models/security/moduleModel';
import { ModuleService } from '../../../../../../shared/services/module.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-module-edit',
standalone:false,  templateUrl: './module-edit.component.html',
  styleUrl: './module-edit.component.css'
})
export class ModuleEditComponent {



  
 rolData: ModuleEdid;

  constructor(
  @Inject('MODAL_DATA') private data: any,
  private dialogRef: MatDialogRef<ModuleEditComponent>,private service : ModuleService
) {
  this.rolData = {
    id: data?.id,
    Name: data?.name || '',
    Description: data?.description || '',
  };
}

onFormSubmit(form: any) {
  const result = {
    ...form,
    id: this.data?.id
  };

console.log(result)

  this.service.actualizar(result).subscribe(()=>{
    this.dialogRef.close(true);
  })
  
}
}
