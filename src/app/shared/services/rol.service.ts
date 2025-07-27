import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { RolCreated, RolList, RolUpdated } from '../Models/security/RolModel';

@Injectable({
  providedIn: 'root'
})
export class RolService extends ServiceBaseService<RolList,RolCreated,RolUpdated>{

  constructor() { 
    super('rol')
  }
}
