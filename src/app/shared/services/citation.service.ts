import { Injectable } from '@angular/core';
import { Citation, CitationEdit, CitationList } from '../Models/hospital/CitationModel';
import { ServiceBaseService } from './base/service-base.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CitationService extends ServiceBaseService<CitationList, any, CitationEdit > {
  constructor() {
    super('citation');
  }
  /**
   * Si en tu API agregaste el endpoint con join:
   * GET /api/citation/list   -> devuelve CitationList[] con NameDoctor/ConsultingRoom/RoomNumber
   */
  traerListado(): Observable<CitationList[]> {
    return this.http.get<CitationList[]>(`${this.urlBase}`);
  }






  /**
   * Endpoint para los bloques usados (tu método GetUsedTimeBlocksByScheduleHourIdAndDateAsync).
   * Supongamos: GET /api/citation/used-timeblocks?scheduleHourId=1&appointmentDate=2025-09-10
   * Devuelve string[] (TimeSpan en texto).
   */
  traerBloquesUsados(
    scheduleHourId: number,
    appointmentDate: string
  ): Observable<string[]> {
    const params = new HttpParams()
      .set('scheduleHourId', scheduleHourId)
      .set('appointmentDate', appointmentDate); // 'YYYY-MM-DD'
    return this.http.get<string[]>(`${this.urlBase}/used-timeblocks`, {
      params,
    });
  }

  /**
   * Actualizar estado y nota de una cita
   */
  updateCitation(data: { id: number; state: string; note: string }): Observable<any> {
    return this.http.put(`${this.urlBase}/`, data);
  }


}
