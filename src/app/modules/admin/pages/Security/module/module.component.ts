import { Component, OnInit } from '@angular/core';
import { ModuleList } from '../../../../../shared/Models/security/moduleModel';
import { ModuleService } from '../../../../../shared/services/module.service';
import { MatDialog } from '@angular/material/dialog';
import { ModuleCreatedComponent } from '../../../Components/forms/FormsCreate/module-created/module-created.component';
import { ModuleEditComponent } from '../../../Components/forms/FormsEdit/module-edit/module-edit.component';
import { CardViewModuleComponent } from '../../../Components/cards/card-view-module/card-view-module.component';
import { DialogContainerComponent } from '../../../../../shared/components/Modal/dialog-container/dialog-container.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-module',
standalone:false,
  templateUrl: './module.component.html',
  styleUrl: './module.component.css'
})
export class ModuleComponent implements OnInit {


constructor(private service: ModuleService ,private dialog: MatDialog) {}

abrirDialog(tipo: 'create' | 'edit' | 'card', datos?: any) {
  const componentMap = {
    create: ModuleCreatedComponent,
    edit: ModuleEditComponent,
    card: CardViewModuleComponent
  };

  const dialogRef = this.dialog.open(DialogContainerComponent, {
    width: '600px',
    data: {
      component: componentMap[tipo], 
      payload: datos 
    }
  });


  dialogRef.backdropClick().subscribe(() => {
  dialogRef.close();
});


  dialogRef.afterClosed().subscribe(result => {
    if (result) { // opcional: verificar si se hizo algún cambio
      this.cargarModules(); // recargar datos
    }
  });
}
  
  dataSource : ModuleList[] = [];
displayedColumns: string[] = ['index', 'name', 'description', 'status', 'detail', 'actions'];


cargarModules() {
  this.service.traerTodo().subscribe(module => {
    this.dataSource = module;
  });
}

ngOnInit(): void {
  this.cargarModules();
}


 eliminar(id: number) {
  Swal.fire({
    title: '¿Estás seguro de eliminar este usuario?',
    text: '¡No podrás revertir esto!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.eliminar(id).subscribe(() => {
        this.cargarModules();
        Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
      });
    }
  });
}

}
