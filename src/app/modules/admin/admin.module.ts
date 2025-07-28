import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { SharedModule } from '../../shared/shared.module';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { RolComponent } from './pages/Security/rol/rol.component';
import { FormComponent } from './pages/Security/form/form.component';
import { MaterialModule } from "../../shared/material.module";
import { ReactiveFormsModule } from '@angular/forms';
import { RolCreatedComponent } from './Components/forms/FormsCreate/rol-created/rol-created.component';
import { FormRolComponent } from './Components/forms/FormsBase/form-rol/form-rol.component';
import { RolEditComponent } from './Components/forms/FormsEdit/rol-edit/rol-edit.component';


@NgModule({
  declarations: [DashboardAdminComponent,
    DoctorComponent,RolComponent,FormComponent,RolCreatedComponent,
    FormRolComponent,RolEditComponent],
  imports: [
    CommonModule,
    AdminRoutingModule, SharedModule,
    MaterialModule,ReactiveFormsModule
]
})
export class AdminModule { }
