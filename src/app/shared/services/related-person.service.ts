import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceBaseService } from './base/service-base.service';
import {
  RelatedPersonCreate,
  RelatedPersonEdit,
  RelatedPersonList,
} from '../Models/hospital/RelatedPerson';

@Injectable({ providedIn: 'root' })
export class RelatedPersonService extends ServiceBaseService<
  RelatedPersonList,
  RelatedPersonCreate,
  RelatedPersonEdit
> {
  // ¡Debe coincidir con el nombre del controller! => /api/RelatedPerson
  constructor() {
    super('RelatedPerson');
  }

  /** GET /api/RelatedPerson/by-person/{personId} */
  getByPerson(personId: number): Observable<RelatedPersonList[]> {
    return this.http.get<RelatedPersonList[]>(
      `${this.urlBase}/by-person/${personId}`
    );
  }

  /** PATCH /api/RelatedPerson/logic/{id}  (borrado lógico) */
  delete(id: number) {
    return this.eliminar(id); // usa DELETE del base
  }
}
