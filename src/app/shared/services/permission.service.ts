import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import {PermissionList,PermissionCreated,PermissionEdit, PermissionListar,} from '../Models/security/permission';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PermissionService extends ServiceBaseService<PermissionList,PermissionCreated,PermissionEdit> {
  constructor() {
    super('Permission');
  }

   private ur = environment.apiURL
  
      public getall( ) :Observable<PermissionListar[]>{
      return this.http.get<PermissionListar[]>(`${this.ur}/api/permission`,);
    }
}
