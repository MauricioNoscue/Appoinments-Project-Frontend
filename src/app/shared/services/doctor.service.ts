import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { DoctorCitation, DoctorList } from '../Models/hospital/DoctorListModel';
import { Specialty } from '../Models/hospital/SpecialtyModel';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { ConsultingRoom } from '../Models/hospital/shedule';
import { SpecialtyService } from './Hospital/specialty.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService extends ServiceBaseService<DoctorList, any, any> {

  constructor(private specialtyService: SpecialtyService) {
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
    return forkJoin({
      doctors: this.http.get<DoctorList>(`${this.urlBase}/GetAllDoctors`),
      specialties: this.specialtyService.traerTodo()
    }).pipe(
      map(({ doctors, specialties }) => {
        // Asumir que doctors tiene specialtyId como string o number
        // Mapear specialtyId a specialtyName
        const specialtyMap = new Map(specialties.map(s => [s.id.toString(), s.name]));
        if (typeof doctors === 'object' && 'specialtyId' in doctors) {
          (doctors as any).specialtyName = specialtyMap.get((doctors as any).specialtyId?.toString()) || 'Especialidad desconocida';
        }
        return doctors;
      })
    );
  }

  // Servicio
  traerDoctorPersona2(): Observable<DoctorList[]> {
    return forkJoin({
      doctors: this.http.get<DoctorList[]>(`${this.urlBase}/GetAllDoctors`),
      specialties: this.specialtyService.traerTodo()
    }).pipe(
      map(({ doctors, specialties }) => {
        const specialtyMap = new Map(specialties.map(s => [s.id.toString(), s.name]));
        return doctors.map(doctor => ({
          ...doctor,
          specialtyName: specialtyMap.get(doctor.specialtyId?.toString()) || 'Especialidad desconocida'
        }));
      })
    );
  }


  public traerDoctorPorId(id: number): Observable<DoctorList> {
    return this.http.get<DoctorList>(`${this.urlBase}/GetByIdDoctor/${id}`);
  }

  public traerDoctorConPersona(id: number): Observable<DoctorList> {
    return this.http.get<DoctorList[]>(`${this.urlBase}/GetAllDoctors`).pipe(
      map(doctors => doctors.find(d => d.id === id) || {} as DoctorList)
    );
  }

  getCitationsByDoctor(doctorId: number) {
    return this.http.get<DoctorCitation[]>(`${this.urlBase}/${doctorId}/citas`);
  }

  private readonly baseUrl = 'https://localhost:7186/api/ConsultingRoom';

  getConsultingRooms(): Observable<ConsultingRoom[]> {
    return this.http.get<ConsultingRoom[]>(`${this.baseUrl}`);
  }


}
