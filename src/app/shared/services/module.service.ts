import { Injectable } from '@angular/core';
import { ModuleCreated, ModuleEdid, ModuleList } from '../Models/security/moduleModel';
import { ServiceBaseService } from './base/service-base.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService extends ServiceBaseService<ModuleList,ModuleCreated,ModuleEdid> {

  constructor() {
    super('module')
   }
}
