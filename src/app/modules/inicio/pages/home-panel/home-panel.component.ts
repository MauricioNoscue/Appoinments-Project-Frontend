import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { UsuarioListado } from '../../../../shared/Models/security/userModel';

@Component({
  selector: 'app-home-panel',
  standalone:false,
  templateUrl: './home-panel.component.html',
  styleUrl: './home-panel.component.css'
})
export class HomePanelComponent implements OnInit{


  public service  =  inject(UserService)

   users: UsuarioListado[]=[];
  ngOnInit(): void {

    this.service.traerTodo().subscribe(users=>{
      this.users= users;

      console.log(users)
    })

  }



}