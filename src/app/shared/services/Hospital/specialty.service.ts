import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../base/service-base.service';
import { Specialty } from '../../Models/hospital/SpecialtyModel';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService extends ServiceBaseService<Specialty, any, any> {

  constructor() {
    super('specialty');
  }
}
