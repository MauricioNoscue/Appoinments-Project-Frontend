import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import {PermissionList,PermissionCreated,PermissionEdit,} from '../Models/security/permission';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionService extends ServiceBaseService<PermissionState,PermissionCreated,PermissionEdit> {
  constructor() {
    super('Permission');
  }
}
