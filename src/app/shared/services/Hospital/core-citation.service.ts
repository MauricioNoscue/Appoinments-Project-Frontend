import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Horario } from '../../Models/socket/models.socket';

// Modelo de respuesta (ajústalo según tu backend)
// export interface TimeBlockEstado {
//   id: number;
//   startTime: string;
//   endTime: string;
//   isAvailable: boolean;
// }


export interface TimeBlockEstado {
  hora: string;
  estaDisponible: boolean;
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
  getAvailableBlocks2(typeCitationId: number, date: Date | string, incluirOcupados: boolean = false): Observable<TimeBlockEstado[]> {
    const params = new HttpParams()
      .set('typeCitationId', typeCitationId)
      .set('date', typeof date === 'string' ? date : date.toISOString())
      .set('incluirOcupados', incluirOcupados);

    return this.http.get<TimeBlockEstado[]>(`${this.urlBase}/core`, { params });
  }




  // Enviar fecha como YYYY-MM-DD (no toISOString para evitar TZ)
  private toYMD(d: Date | string): string {
    if (typeof d === 'string') return d.slice(0, 10);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

getAvailableBlocks(
  typeCitationId: number,
  date: Date | string,
  incluirOcupados = false
): Observable<Horario[]> {
  const params = new HttpParams()
    .set('typeCitationId', typeCitationId)
    .set('date', this.toYMD(date))   // <-- siempre YYYY-MM-DD
    .set('incluirOcupados', incluirOcupados);

  return this.http.get<Horario[]>(`${this.urlBase}/core`, { params });
}


}
