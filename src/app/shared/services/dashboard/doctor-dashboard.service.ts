import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

import { HttpClient } from '@angular/common/http';
import { DoctorDashboardVMv2 } from '../../Models/dashboard/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DoctorDashboardService {
  private base = environment.apiURL + '/api/dashboard/doctor';

  constructor(private http: HttpClient) {}

  get(doctorId: number): Observable<DoctorDashboardVMv2> {
    return this.http.get<DoctorDashboardVMv2>(`${this.base}/${doctorId}`);
  }
}
