import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { DashboardLayoutComponentComponent } from '../../shared/components/dashboard-layout-component/dashboard-layout-component.component';
import { SharedModule } from '../../shared/shared.module';
import { DoctorComponent } from './pages/doctor/doctor.component';


@NgModule({
  declarations: [DashboardAdminComponent,DoctorComponent],
  imports: [
    CommonModule,
    AdminRoutingModule, SharedModule 
  ]
})
export class AdminModule { }
