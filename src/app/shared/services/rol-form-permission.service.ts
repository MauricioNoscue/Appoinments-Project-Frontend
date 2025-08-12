import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AssignPermissionsDto, UpdateRolFormPermissionsDto } from '../Models/security/RolModel';

@Injectable({
  providedIn: 'root'
})
export class RolFormPermissionService {

  private api = `${environment.apiURL}/api/RolFormPermission`;

  constructor(private http: HttpClient) {}

  assignPermissions(dto: AssignPermissionsDto) {
    return this.http.post(`${this.api}/assign`, dto);
  }

  updatePermissions(dto: UpdateRolFormPermissionsDto) {
    return this.http.put(`${this.api}/update-permissions`, dto);
  }
  
}
