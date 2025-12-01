import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { DoctorCitation, DoctorList } from '../Models/hospital/DoctorListModel';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { ConsultingRoom } from '../Models/hospital/shedule';
import { environment } from '../../../environments/environment.development';

export interface DoctorUpdateDto {
  id: number;
  specialtyId: number;
  personId: number;
  emailDoctor: string;
  image: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService extends ServiceBaseService<DoctorList, any, DoctorUpdateDto> {

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

  // private readonly baseUrl = 'http://localhost:5200/api/ConsultingRoom';
  // private readonly baseUrl = 'http://localhost:8080/api/ConsultingRoom';


  getConsultingRooms(): Observable<ConsultingRoom[]> {
    return this.http.get<ConsultingRoom[]>(`${environment.apiURL}/api/ConsultingRoom`);
  }

  public actualizarDoctor(dto: DoctorUpdateDto): Observable<boolean> {
    // Si la imagen es grande, usar multipart/form-data
    if (dto.image && dto.image.length > 50000) { // ~50KB - umbral equilibrado
      return this.actualizarConImagenGrande(dto);
    }
    return this.actualizar(dto);
  }

  public crearDoctor(dto: any): Observable<any> {
    // Si la imagen es grande, usar multipart/form-data
    if (dto.image && dto.image.length > 50000) { // ~50KB - umbral equilibrado
      return this.crearConImagenGrande(dto);
    }
    return this.crear(dto);
  }

  private crearConImagenGrande(dto: any): Observable<any> {
    const formData = new FormData();

    // Agregar campos básicos
    formData.append('specialtyId', dto.specialtyId.toString());
    formData.append('emailDoctor', dto.emailDoctor);
    formData.append('active', dto.active.toString());
    formData.append('personId', dto.personId.toString());

    // Procesar imagen
    if (dto.image) {
      if (dto.image.startsWith('data:')) {
        // Convertir data URL a blob
        const base64Data = dto.image.split(',')[1];
        const mimeType = dto.image.split(';')[0].split(':')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        formData.append('imageFile', blob, 'image.jpg');
        formData.append('image', ''); // Enviar vacío ya que usamos imageFile
      } else {
        formData.append('image', dto.image);
      }
    }

    return this.http.post<any>(this.urlBase, formData);
  }

  private actualizarConImagenGrande(dto: DoctorUpdateDto): Observable<boolean> {
    const formData = new FormData();

    // Agregar campos básicos
    formData.append('id', dto.id.toString());
    formData.append('specialtyId', dto.specialtyId.toString());
    formData.append('personId', dto.personId.toString());
    formData.append('emailDoctor', dto.emailDoctor);
    formData.append('active', dto.active.toString());

    // Procesar imagen
    if (dto.image) {
      if (dto.image.startsWith('data:')) {
        // Convertir data URL a blob
        const base64Data = dto.image.split(',')[1];
        const mimeType = dto.image.split(';')[0].split(':')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        formData.append('imageFile', blob, 'image.jpg');
        formData.append('image', ''); // Enviar vacío ya que usamos imageFile
      } else {
        formData.append('image', dto.image);
      }
    }

    return this.http.put<boolean>(this.urlBase, formData);
  }

  public toBase64Raw(dataUrl: string): string {
    if (!dataUrl || !dataUrl.includes(',')) return '';
    return dataUrl.split(',')[1];
  }

}
