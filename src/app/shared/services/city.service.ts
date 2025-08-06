import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { CityList } from '../Models/parameter/CityModel';

@Injectable({
  providedIn: 'root'
})
export class CityService extends ServiceBaseService<CityList, any, any> {

  constructor() { 
    super('city');
  }
}
