import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { UsuarioListado, UsuarioCreacion, UsuarioEdicion } from '../Models/security/userModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ServiceBaseService<UsuarioListado ,UsuarioCreacion,UsuarioEdicion  > {
 constructor() {
    super('User'); 
  }

    public login(data: { email: string; password: string }): Observable<boolean> {
    return this.http.post<boolean>(`${this.urlBase}/login`, data);
  }


}
