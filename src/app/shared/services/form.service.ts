import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { FormList } from '../Models/security/FormModel';

@Injectable({
  providedIn: 'root'
})
export class FormService extends ServiceBaseService<FormList, any, any> {
  constructor() {
    super('form');
  }
}