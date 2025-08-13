import { Injectable } from '@angular/core';
import { Citation } from '../Models/hospital/CitationModel';
import { ServiceBaseService } from './base/service-base.service';

@Injectable({
  providedIn: 'root'
})
export class CitationService extends ServiceBaseService<Citation, any, any> {

  constructor() {
    super('citation');
  }
}
