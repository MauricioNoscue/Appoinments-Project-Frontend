import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { UsuarioListado, UsuarioEdicion, LoginModel } from '../Models/security/userModel';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { UsuarioCreacion } from '../../modules/admin/Components/forms/FormsBase/form-user/form-user.component';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ServiceBaseService<UsuarioListado ,UsuarioCreacion,UsuarioEdicion  > {
 constructor() {
    super('User'); 
  }

private ur = environment.apiURL

    public login(data:LoginModel ) {
    return this.http.post<any>(`${this.ur}/api/auth/login`, data);
  }


}
