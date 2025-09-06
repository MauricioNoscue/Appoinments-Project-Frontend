import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export type Gender = 'Masculino' | 'Femenino';

export interface ProfileStatsItem {
  label: string;
  value: number;
  color: string; // hex o rgb
}

export interface UserProfile {
  id: number;
  fullName: string;
  dateBorn: string;      // ISO (yyyy-mm-dd)
  gender: Gender;
  documentType: 'CC' | 'TI' | 'CE' | 'PA';
  documentNumber: string;
  epsName: string;
  healthRegime: 'Contributivo' | 'Subsidiado';
  phoneNumber: string;
  email: string;
  avatarBase64?: string | null; // opcional
  toleranceLevel: 0 | 1 | 2 | 3;
  yearStats: ProfileStatsItem[];
}

@Injectable({ providedIn: 'root' })
export class ProfileService {

  // Mock inicial (reemplázalo por la carga real cuando haya sesión)
  private readonly _state = new BehaviorSubject<UserProfile>({
    id: 42,
    fullName: 'Daniel Gomez Martinez',
    dateBorn: '1985-03-15',
    gender: 'Masculino',
    documentType: 'CC',
    documentNumber: '1023456789',
    epsName: 'Sanitas',
    healthRegime: 'Contributivo',
    phoneNumber: '3001234567',
    email: 'daniel.gomez@example.com',
    avatarBase64: null,
    toleranceLevel: 1,
    yearStats: [
      { label: 'Enero', value: 12, color: '#22c55e' },
      { label: 'Febrero', value: 22, color: '#3b82f6' },
      { label: 'Marzo', value: 12, color: '#a855f7' },
      { label: 'Abril', value: 12, color: '#f59e0b' },
      { label: 'Mayo', value: 7,  color: '#06b6d4' },
      { label: 'Junio', value: 7,  color: '#ef4444' },
      { label: 'Julio', value: 0,  color: '#c20bf5ff' },
      { label: 'Agosto', value: 2,  color: '#c52248ff' },
      { label: 'Septiembre', value: 1,  color: '#bbf63bff' },
      { label: 'Octubre', value: 5,  color: '#55f7c9b3' },
      { label: 'Noviembre', value: 1,  color: '#e78787ff' },
      { label: 'Diciembre', value: 0,  color: '#b3007dff' },
    ]
  });

  profile$ = this._state.asObservable();

  // Simula GET por id (para integrar con sesión luego)
  loadById(id: number): Observable<UserProfile> {
    return of(this._state.value); // reemplazar por this.http.get(...)
  }

  updatePersonal(partial: Partial<Pick<UserProfile, 'fullName' | 'gender'>>): Observable<UserProfile> {
    this._state.next({ ...this._state.value, ...partial });
    return of(this._state.value);
  }

  updateHealth(partial: Partial<Pick<UserProfile, 'epsName' | 'healthRegime'>>): Observable<UserProfile> {
    this._state.next({ ...this._state.value, ...partial });
    return of(this._state.value);
  }

  updateContact(partial: Partial<Pick<UserProfile, 'phoneNumber' | 'email'>>): Observable<UserProfile> {
    this._state.next({ ...this._state.value, ...partial });
    return of(this._state.value);
  }
}
