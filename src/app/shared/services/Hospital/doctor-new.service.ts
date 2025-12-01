
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { CitationList, SheduleList } from '../../Models/newdoctor';
import { environment } from '../../../../environments/environment.development';



@Injectable({
  providedIn: 'root'
})
export class DoctorNewService {

 
  private readonly baseUrl = environment.apiURL+'/api'; // ⚠️ Ajusta si tu API usa otro prefijo

  constructor(private http: HttpClient) {}

  // ================================================================
  // Obtener el horario asignado del doctor (consultorio, room, etc.)
  // ================================================================
  getSheduleByDoctor(doctorId: number): Observable<SheduleList[]> {
    return this.http.get<SheduleList[]>(
      `${this.baseUrl}/Shedule/listShedule/${doctorId}`
    );
  }

  // =====================================================================
  // Obtener las citas programadas del doctor para una fecha específica
  // =====================================================================
  getCitationsByDoctor(doctorId: number, date: string): Observable<CitationList[]> {
    // params para enviar la fecha real
    const params = new HttpParams().set('date', date);

    return this.http.get<CitationList[]>(
      `${this.baseUrl}/citation/listDoctor/${doctorId}`,
      { params }
    );
  }}
