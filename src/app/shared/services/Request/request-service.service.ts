import { Injectable } from '@angular/core';
import { ModificationRequestCreateDto, ModificationRequestEditDto, ModificationRequestListDto } from '../../Models/Request/ModificationRequest';
import { ServiceBaseService } from '../base/service-base.service';

@Injectable({
  providedIn: 'root'
})
export class RequestServiceService extends ServiceBaseService<
  ModificationRequestListDto,
  ModificationRequestCreateDto,
  ModificationRequestEditDto
>  {

  constructor() {
    super('ModificationRequest'); 
  }

}
