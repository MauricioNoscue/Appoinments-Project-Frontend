import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { DepartamentCreated, DepartamentEdit, DepartamentList } from '../Models/parameter/Departament';

@Injectable({
  providedIn: 'root',
})
export class DepartamentService extends ServiceBaseService<DepartamentList,DepartamentCreated,DepartamentEdit> {
  constructor() {
    super('Departament');
  }
}
