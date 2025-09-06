import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';

export interface DoctorActivity {
  id: number;
  doctorId: number;
  loginTime: string;
  logoutTime?: string;
  sessionDuration?: number; // en minutos
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorActivityService extends ServiceBaseService<DoctorActivity, any, any> {

  constructor() {
    super('doctor-activity'); // Cambiar por el endpoint real cuando esté disponible
  }

  // Método para obtener actividad semanal de un doctor
  getWeeklyActivity(doctorId: number): any {
    // TODO: Implementar cuando el backend tenga este endpoint
    // return this.http.get(`${this.urlBase}/weekly/${doctorId}`);
    return null;
  }

  // Método para calcular horas activas en la semana
  calculateActiveHours(activities: DoctorActivity[]): number {
    return activities.reduce((total, activity) => {
      if (activity.sessionDuration) {
        return total + (activity.sessionDuration / 60); // convertir a horas
      }
      return total;
    }, 0);
  }
}