import { Injectable } from '@angular/core';
import { TypeCitation } from '../../components/PagesShared/type-citation/type-citation.component';
import { ServiceBaseService } from '../base/service-base.service';

@Injectable({
  providedIn: 'root'
})
export class TypeCitationService extends ServiceBaseService<TypeCitation, any, any>{

  constructor() {
    super('TypeCitation');
   }

   
}
