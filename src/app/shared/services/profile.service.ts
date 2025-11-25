import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, forkJoin, map, switchMap, catchError } from 'rxjs';
import { UserService } from './user.service';
import { PersonaService } from './persona.service';
import { CitationService } from './citation.service';
import { UsuarioListado, PersonList } from '../Models/security/userModel';

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
  rescheduling: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {

  private readonly _state = new BehaviorSubject<UserProfile | null>(null);
  profile$ = this._state.asObservable();

  // EPS options (hardcodeado por ahora, luego crear servicio)
  private epsOptions = [
    { id: 1, nombre: 'Sura' },
    { id: 2, nombre: 'Sanitas' },
    { id: 3, nombre: 'Nueva EPS' },
    { id: 4, nombre: 'Coomeva' }
  ];

  constructor(
    private userService: UserService,
    private personaService: PersonaService,
    private citationService: CitationService
  ) {}

  loadById(id: number): Observable<UserProfile> {
    return this.userService.obtenerPorId(id).pipe(
      switchMap(user => {
        if (!user) {
          // Fallback a datos mock si el backend no responde
          console.warn('Usuario no encontrado, usando datos mock');
          return of(this.getMockProfile());
        }

        // Usar personId del usuario para cargar datos de persona
        const personId = (user as UsuarioListado).personId;
        return this.personaService.obtenerPorId(personId).pipe(
          map(person => this.mapToUserProfile(user as UsuarioListado, person as PersonList)),
          catchError(() => {
            // Fallback si persona no se encuentra
            console.warn('Persona no encontrada, usando datos mock');
            return of(this.getMockProfile());
          })
        );
      }),
      switchMap(profile => {
        // Cargar estadísticas de citas
        return this.loadCitationStats(profile.id).pipe(
          map(stats => ({ ...profile, yearStats: stats }))
        );
      }),
      catchError(() => {
        // Fallback completo si todo falla
        console.warn('Error cargando perfil, usando datos mock');
        return of(this.getMockProfile());
      })
    );
  }

  private mapToUserProfile(user: UsuarioListado, person: PersonList): UserProfile {
    const eps = this.epsOptions.find(e => e.id === person.epsId);
    return {
      id: user.id,
      fullName: `${person.fullName} ${person.fullLastName}`,
      dateBorn: person.dateBorn,
      gender: person.gender as Gender,
      documentType: 'CC', // hardcodeado, ajustar según documentTypeId
      documentNumber: person.document,
      epsName: eps?.nombre || 'Desconocida',
      healthRegime: person.healthRegime as 'Contributivo' | 'Subsidiado',
      phoneNumber: person.phoneNumber,
      email: user.email,
      avatarBase64: null,
      toleranceLevel: 1, // hardcodeado
      yearStats: [] ,// se carga después
      rescheduling: user.rescheduling ?? false

    };
  }

  private getMockProfile(): UserProfile {
    return {
      id: 1,
      fullName: 'Mauricio',
      dateBorn: '1990-01-01',
      gender: 'Masculino',
      documentType: 'CC',
      documentNumber: '1234567890',
      epsName: 'Sura',
      healthRegime: 'Contributivo',
      phoneNumber: '3001234567',
      email: 'mauronoscue@gmail.com',
      avatarBase64: null,
      toleranceLevel: 1,
      rescheduling: false ,// hardcodeado

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
    };
  }

  private loadCitationStats(userId: number): Observable<ProfileStatsItem[]> {
    // Asumir que hay un método para obtener citas por usuario
    // Por ahora, mock
    return of([
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
    ]);
  }

  updatePersonal(partial: Partial<Pick<UserProfile, 'fullName' | 'gender'>>): Observable<UserProfile> {
    const current = this._state.value;
    if (!current) return of(current!);

    // Separar fullName en fullName y fullLastName
    const [firstName, ...lastNames] = partial.fullName?.split(' ') || [];
    const lastName = lastNames.join(' ');

    const personUpdate = {
      id: 1, // personId hardcodeado
      fullName: firstName || '',
      fullLastName: lastName || '',
      documentTypeId: 1, // hardcodeado
      document: current.documentNumber,
      dateBorn: current.dateBorn,
      phoneNumber: current.phoneNumber,
      epsId: 1, // hardcodeado
      gender: partial.gender || current.gender,
      healthRegime: current.healthRegime
    };

    return this.personaService.actualizar(personUpdate).pipe(
      map(() => {
        const updated = { ...current, ...partial };
        this._state.next(updated);
        return updated;
      })
    );
  }

  updateHealth(partial: Partial<Pick<UserProfile, 'epsName' | 'healthRegime'>>): Observable<UserProfile> {
    const current = this._state.value;
    if (!current) return of(current!);

    const epsId = this.epsOptions.find(e => e.nombre === partial.epsName)?.id || 1;

    const personUpdate = {
      id: 1, // personId hardcodeado
      fullName: current.fullName.split(' ')[0],
      fullLastName: current.fullName.split(' ').slice(1).join(' '),
      documentTypeId: 1,
      document: current.documentNumber,
      dateBorn: current.dateBorn,
      phoneNumber: current.phoneNumber,
      epsId: epsId,
      gender: current.gender,
      healthRegime: partial.healthRegime || current.healthRegime
    };

    return this.personaService.actualizar(personUpdate).pipe(
      map(() => {
        const updated = { ...current, ...partial };
        this._state.next(updated);
        return updated;
      })
    );
  }

  updateContact(partial: Partial<Pick<UserProfile, 'phoneNumber' | 'email'>>): Observable<UserProfile> {
    const current = this._state.value;
    if (!current) return of(current!);

    // Actualizar persona para phoneNumber
    const personUpdate = {
      id: 1, // personId hardcodeado
      fullName: current.fullName.split(' ')[0],
      fullLastName: current.fullName.split(' ').slice(1).join(' '),
      documentTypeId: 1,
      document: current.documentNumber,
      dateBorn: current.dateBorn,
      phoneNumber: partial.phoneNumber || current.phoneNumber,
      epsId: 1,
      gender: current.gender,
      healthRegime: current.healthRegime
    };

    // Actualizar user para email
    const userUpdate = {
      id: 1, // userId hardcodeado
      email: partial.email || current.email,
      password: '', // no cambiar
      active: true,
      personId: 1
    };

    return forkJoin([
      this.personaService.actualizar(personUpdate),
      this.userService.actualizar(userUpdate)
    ]).pipe(
      map(() => {
        const updated = { ...current, ...partial };
        this._state.next(updated);
        return updated;
      })
    );
  }
}
