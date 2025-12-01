import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DoctorDashboardVMv2 } from "../Models/dashboard/dashboard.model";
import { DoctorDashboardService } from "../services/dashboard/doctor-dashboard.service";

@Injectable({ providedIn: 'root' })
export class DoctorDashboardFacade {
  constructor(private srv: DoctorDashboardService) {}

  load(doctorId: number): Observable<DoctorDashboardVMv2> {
    return this.srv.get(doctorId);
  }
}
