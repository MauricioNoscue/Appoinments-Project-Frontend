import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../base/service-base.service';
import { EpsList } from '../../Models/hospital/epsListModel';

@Injectable({
  providedIn: 'root'
})
export class EpsService extends ServiceBaseService<EpsList, any, any> {

  constructor() {
    super('eps');
   }
}
