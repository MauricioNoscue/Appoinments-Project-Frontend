import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

// Modelo de respuesta (ajústalo según tu backend)
export interface TimeBlockEstado {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CoreCitationService {

  private http = inject(HttpClient);
  private urlBase: string;

  constructor() {
    this.urlBase = environment.apiURL + '/api/CitationCore';
  }

  /**
   * Obtiene los bloques disponibles de citas según tipo, fecha y si incluye ocupados.
   * @param typeCitationId Id del tipo de cita
   * @param date Fecha seleccionada (Date o string en formato yyyy-MM-dd)
   * @param incluirOcupados Si true, también devuelve los bloques ocupados
   */
  getAvailableBlocks(typeCitationId: number, date: Date | string, incluirOcupados: boolean = false): Observable<TimeBlockEstado[]> {
    const params = new HttpParams()
      .set('typeCitationId', typeCitationId)
      .set('date', typeof date === 'string' ? date : date.toISOString())
      .set('incluirOcupados', incluirOcupados);

    return this.http.get<TimeBlockEstado[]>(`${this.urlBase}/core`, { params });
  }
}
