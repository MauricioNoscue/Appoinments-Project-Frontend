import { ComponentType } from '@angular/cdk/overlay';
import { AfterViewInit, Component, ComponentFactoryResolver, Inject, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-container',
  standalone:false,
  templateUrl: './dialog-container.component.html',
  styleUrl: './dialog-container.component.css'
})
export class DialogContainerComponent implements AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef }) containerRef!: ViewContainerRef;
  customInjector: Injector;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { component: ComponentType<any>, payload?: any },
    private injector: Injector,
    private dialogRef: MatDialogRef<DialogContainerComponent>,
    private cfr: ComponentFactoryResolver
  ) {
    this.customInjector = Injector.create({
      providers: [
        { provide: 'MODAL_DATA', useValue: data.payload },
        { provide: MatDialogRef, useValue: dialogRef }
      ],
      parent: this.injector
    });
  }

  ngAfterViewInit(): void {
    const factory = this.cfr.resolveComponentFactory(this.data.component);
    const componentRef = this.containerRef.createComponent(factory, 0, this.customInjector);

    // Aquí capturamos el evento formSubmit
    componentRef.instance.formSubmit.subscribe((formularioData: any) => {
      this.dialogRef.close(formularioData);
    });
  }
}

 