import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { TypeCitationCreateDto } from '../components/PagesShared/type-citation/type-citation.component';

@Injectable({
  providedIn: 'root'
})
export class TypeCitationsService  extends ServiceBaseService<
  any,
  TypeCitationCreateDto,
  any
> {

  constructor() { 

      super('TypeCitation'); 
  }
}
