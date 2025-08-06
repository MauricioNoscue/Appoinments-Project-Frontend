import { Injectable } from '@angular/core';
import { InstitutionList } from '../Models/parameter/InstitutionModel';
import { ServiceBaseService } from './base/service-base.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService extends ServiceBaseService<InstitutionList, any, any> {

  constructor() { 
    super('institution');
  }
}
