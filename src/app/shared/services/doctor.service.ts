import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { DoctorList } from '../Models/hospital/DoctorListModel';

@Injectable({
  providedIn: 'root'
})
export class DoctorService extends ServiceBaseService<DoctorList, any, any> {

  constructor() {
    super('doctor');
  }
}
