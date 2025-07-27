import { ComponentType } from '@angular/cdk/overlay';
import { Component, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-container',
  standalone:false,
  templateUrl: './dialog-container.component.html',
  styleUrl: './dialog-container.component.css'
})
export class DialogContainerComponent {
 customInjector: Injector;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { component: ComponentType<any>, payload?: any },
    private injector: Injector,
     private dialogRef: MatDialogRef<DialogContainerComponent>,
  ) {
    this.customInjector = Injector.create({
      providers: [
        { provide: 'MODAL_DATA', useValue: data.payload },
          { provide: MatDialogRef, useValue: dialogRef } 
      ],
      parent: this.injector
    });
  }

}
 