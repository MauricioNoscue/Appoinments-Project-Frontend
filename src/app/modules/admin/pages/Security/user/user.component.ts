import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioListado } from '../../../../../shared/Models/security/userModel';
import { DialogContainerComponent } from '../../../../../shared/components/Modal/dialog-container/dialog-container.component';
import { UserCreateComponent } from '../../../Components/forms/FormsCreate/user-create/user-create.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ColumnDefinition } from '../../../../../shared/Models/Tables/TableModels';

@Component({
  selector: 'app-user',
  standalone:false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
constructor(private service: UserService ,private dialog: MatDialog,private route :Router) {}


columnDefs: ColumnDefinition[] = [
  { key: 'index', label: '#', type: 'text' },
  { key: 'email', label: 'Correo' },
  { key: 'personName', label: 'Nombre' },
  {
    key: 'active',
    label: 'Activo',
    type: 'chip',
    colorFn: (x) => (x.active ? 'primary' : 'warn'),
    format: (x) => (x.active ? 'Sí' : 'No'),
  },
  { key: 'restrictionPoint', label: 'Restricción' },
  { key: 'actions', label: 'Acciones', type: 'actions' },
];

handleAction(e: { action: string; element: any }) {
  const { action, element } = e;
  if (action === 'delete') this.eliminar(element.id);
  if (action === 'detail') this.route.navigate(['/admin/security/gestion', element.id]);
  if (action === 'edit') this.abrirDialog('edit', element);
}


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
    if (result) { 
      this.cargarUsers(); 
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
  'index',          
  'email',          
  'personName',     
  'active',         
  'restrictionPoint',
  'actions'    
];

Detalle(id:number){
  this.route.navigate(['/admin/security/gestion',id])
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
        this.cargarUsers();
        Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
      });
    }
  });
}
}
