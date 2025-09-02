import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { DoctorList } from '../Models/hospital/DoctorListModel';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ConsultingRoom } from '../Models/hospital/shedule';

@Injectable({
  providedIn: 'root'
})
export class DoctorService extends ServiceBaseService<DoctorList, any, any> {

  constructor() {
    super('doctor');
  }

  public traerConFiltros(filters: any): Observable<DoctorList[]> {
    let params = new HttpParams();
    for (const key in filters) {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    }
    return this.http.get<DoctorList[]>(this.urlBase, { params });
  }

  public traerDoctorPersona(): Observable<DoctorList> {
    return this.http.get<DoctorList>(`${this.urlBase}/GetAllDoctors`);
  }

  // Servicio
traerDoctorPersona2(): Observable<DoctorList[]> {
  return this.http.get<DoctorList[]>(`${this.urlBase}/GetAllDoctors`);
}


  public traerDoctorPorId(id: number): Observable<DoctorList> {
    return this.http.get<DoctorList>(`${this.urlBase}/GetDoctorById/${id}`);
  }

   private readonly baseUrl = 'https://localhost:7186/api/ConsultingRoom';

getConsultingRooms(): Observable<ConsultingRoom[]> {
  return this.http.get<ConsultingRoom[]>(`${this.baseUrl}`);
}


}
