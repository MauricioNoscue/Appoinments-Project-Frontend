import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { shedule } from '../../Models/hospital/shedule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  
  protected http = inject(HttpClient);
   protected urlBase = environment.apiURL + '/api';


   
    getgeneric(entity: string): Observable<any[]> {
       return this.http.get<any[]>(`${this.urlBase}/${entity}`);
     }
    
   

     public crearGeneric(entity: string, data: any): Observable<any> {
     return this.http.post<any>(`${this.urlBase}/${entity}`,data);
      }





}
