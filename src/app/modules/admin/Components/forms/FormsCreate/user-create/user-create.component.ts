import { Component, ViewChild } from '@angular/core';
import { FormUserComponent, PersonaCreacion, PersonaCreada, UsuarioCompleto, UsuarioCreacion } from '../../FormsBase/form-user/form-user.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PersonaService } from '../../../../../../shared/services/persona.service';
import { UserService } from '../../../../../../shared/services/user.service';

@Component({
  selector: 'app-user-create',
 standalone:false,
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
 @ViewChild('formUsuario') formUsuario!: FormUserComponent;
private personaIdCreada!: number;

  constructor(
    private dialogRef: MatDialogRef<UserCreateComponent>,
    private route: Router,
     private personaService: PersonaService,
    private usuarioService: UserService
  ) {}

onPersonaCreated(personaData: PersonaCreacion) {
  this.personaService.crear(personaData).subscribe(personaCreada => {
    this.personaIdCreada = personaCreada.id;
    this.formUsuario.onPersonaCreatedSuccess(personaCreada);
  });
}


  onUsuarioSubmit(usuario: UsuarioCreacion) {
  // Inyectar el ID de la persona creada
  usuario.personId = this.personaIdCreada;
console.log("este")
  console.log(usuario)
this.usuarioService.crear(usuario).subscribe(()=>{
 this.dialogRef.close(true);

})
}

}
