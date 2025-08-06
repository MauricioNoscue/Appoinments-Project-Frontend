import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioListado } from '../../../../../shared/Models/security/userModel';
import { DialogContainerComponent } from '../../../../../shared/components/Modal/dialog-container/dialog-container.component';
import { UserCreateComponent } from '../../../Components/forms/FormsCreate/user-create/user-create.component';

@Component({
  selector: 'app-user',
  standalone:false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
constructor(private service: UserService ,private dialog: MatDialog) {}


abrirDialog(tipo: 'create' | 'edit' | 'card', datos?: any) {
  const componentMap = {
    create: UserCreateComponent,
     edit: UserCreateComponent,
    card: UserCreateComponent
   
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
      this.cargarUsers(); // recargar datos
    }
  });
}


cargarUsers() {
  this.service.traerTodo().subscribe(users => {
    this.dataSource = users;
  });
}



ngOnInit(): void {
  this.cargarUsers();
}

dataSource : UsuarioListado[] = [];
displayedColumns: string[] = [
  'index',           // para numeración
  'email',           // correo del usuario
  'personName',      // nombre de la persona
  'active',          // estado activo/inactivo
  'restrictionPoint',// puntos de restricción
  'isDeleted',       // estado de eliminación
  'actions'          // botones de editar/eliminar
];

}
