import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { RolUserList, RolUserCreated } from '../Models/security/RolUserModel';

@Injectable({
  providedIn: 'root'
})
export class RolUserService extends ServiceBaseService <RolUserCreated,RolUserList,any> {

  constructor() {
    super('rolUser')
  }
}
