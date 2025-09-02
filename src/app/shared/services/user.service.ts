import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { UsuarioListado, UsuarioEdicion, LoginModel, UserDetailDto } from '../Models/security/userModel';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { UsuarioCreacion } from '../../modules/admin/Components/forms/FormsBase/form-user/form-user.component';
import { RolPermisosResponse, AssignRolesDto, UpdateUserRolesDto } from '../Models/security/RolModel';
import { MenuItem } from '../Models/ManuItemModel';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ServiceBaseService<UsuarioListado ,UsuarioCreacion,UsuarioEdicion  > {
 constructor() {
    super('User'); 
  }

private ur = environment.apiURL

  private readonly baseUrl = 'https://localhost:7186/api/security/menu';

    public login(data:LoginModel ) {
    return this.http.post<any>(`${this.ur}/api/auth/login`, data);
  }

    getUserDetail(id: number) {
    return this.http.get<UserDetailDto>(`${this.ur}/api/user/${id}/userDetail`);
  }

  getRolesAndPermissions(userId: number) {
    return this.http.get<RolPermisosResponse[]>(`${this.ur}/api/roluser/${userId}/roles-permissions`);
  }

  assignMultipleRoles(dto: AssignRolesDto) {
    return this.http.post(`${this.ur}/api/roluser/assign-multiple`, dto);
  }

  updateUserRoles(dto: UpdateUserRolesDto) {
    return this.http.put(`${this.ur}/api/roluser/update-roles`, dto);
  }



 getMenu(roleId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.baseUrl}?roleId=${roleId}`);
  }

}
