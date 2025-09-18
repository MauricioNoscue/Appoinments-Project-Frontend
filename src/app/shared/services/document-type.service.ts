import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService extends ServiceBaseService<any, any, any> {

  constructor() {
    super('documentType');
  }
}
