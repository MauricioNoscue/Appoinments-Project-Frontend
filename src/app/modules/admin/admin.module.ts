import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { SharedModule } from '../../shared/shared.module';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { RolComponent } from './pages/Security/rol/rol.component';
import { FormComponent } from './pages/Security/form/form.component';
import { MaterialModule } from "../../shared/material.module";


@NgModule({
  declarations: [DashboardAdminComponent,DoctorComponent,RolComponent,FormComponent,],
  imports: [
    CommonModule,
    AdminRoutingModule, SharedModule,
    MaterialModule
]
})
export class AdminModule { }
