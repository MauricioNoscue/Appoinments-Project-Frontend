import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { PersonList, PersonUpdate } from '../Models/security/userModel';
import { PersonaCreacion } from '../../modules/admin/Components/forms/FormsBase/form-user/form-user.component';

@Injectable({
  providedIn: 'root'
})
export class PersonaService extends ServiceBaseService<PersonList,PersonaCreacion,PersonUpdate> {

  constructor() { 
  super('person')
  }
}


