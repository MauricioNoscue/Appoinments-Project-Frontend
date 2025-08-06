import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RolService } from '../../../../../shared/services/rol.service';
import { RolList } from '../../../../../shared/Models/security/RolModel';
import { MatDialog } from '@angular/material/dialog';
import { DialogContainerComponent } from '../../../../../shared/components/Modal/dialog-container/dialog-container.component';
import { RolCreatedComponent } from '../../../Components/forms/FormsCreate/rol-created/rol-created.component';
import { RolEditComponent } from '../../../Components/forms/FormsEdit/rol-edit/rol-edit.component';
import { CardViewRolComponent } from '../../../Components/cards/card-view-rol/card-view-rol.component';

@Component({
  selector: 'app-rol',
 standalone:false,
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css'
})
export class RolComponent implements OnInit {
constructor(private service: RolService ,private dialog: MatDialog) {}


abrirDialog(tipo: 'create' | 'edit' | 'card', datos?: any) {
  const componentMap = {
    create: RolCreatedComponent,
    edit: RolEditComponent,
    card: CardViewRolComponent
  };

  const dialogRef = this.dialog.open(DialogContainerComponent, {
    width: '600px',
    data: {
      component: componentMap[tipo], 
      payload: datos 
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) { // opcional: verificar si se hizo algún cambio
      this.cargarRoles(); // recargar datos
    }
  });
}


dataSource : RolList[] = [];

  cargarRoles() {
  this.service.traerTodo().subscribe(rol => {
    this.dataSource = rol;
  });
}

ngOnInit(): void {
  this.cargarRoles();
}

displayedColumns: string[] = ['index', 'name', 'description', 'status', 'detail', 'actions'];
  searchTerm: string = '';

  eliminar(id : number){

    this.service.eliminar(id).subscribe(()=>{
      this.cargarRoles();
    })
    console.log('id a eliminar  ',id)
  }

}
