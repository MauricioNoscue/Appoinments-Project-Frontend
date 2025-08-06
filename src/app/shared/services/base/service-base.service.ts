import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';


export class ServiceBaseService<TList,TCreate,TUpdate> {

  protected http = inject(HttpClient);
  protected urlBase: string;

  constructor(url: string) {
    this.urlBase = environment.apiURL + '/api/' + url;
  }


    public traerTodo(): Observable<TList[]> {
    return this.http.get<TList[]>(this.urlBase);
    }

  public obtenerPorId(id: number): Observable<TList> {
    return this.http.get<TList>(`${this.urlBase}/${id}`);
    }

  public crear(data: TCreate): Observable<any> {
    return this.http.post<any>(this.urlBase, data);
  }

 public actualizar(item: TUpdate): Observable<boolean> {
  return this.http.put<boolean>(this.urlBase, item);
  }

  public eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
   }



}
