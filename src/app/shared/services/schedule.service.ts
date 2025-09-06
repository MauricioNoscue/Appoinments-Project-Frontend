import { Injectable } from '@angular/core';
import { shedule } from '../Models/hospital/shedule';
import { ServiceBaseService } from './base/service-base.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends ServiceBaseService<shedule, any, any> {

  constructor() {
    super('schedule');
  }
}
