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
import { FormPermissionComponent } from './Components/forms/FormsBase/form-permission/form-permission.component';
import { FormEditPermissionComponent } from './Components/forms/FormsEdit/form-edit-permission/form-edit-permission.component';
import { FormCreatePermissionComponent } from './Components/forms/FormsCreate/form-create-permission/form-create-permission.component';
import { PermissionCreatedComponent } from './Components/forms/FormsCreate/permission-created/permission-created.component';
import { PermissionEditComponent } from './Components/forms/FormsEdit/permission-edit/permission-edit.component';
import { PermissionComponent } from './pages/Security/permission/permission.component';


@NgModule({
  declarations: [
    DashboardAdminComponent,
    DoctorComponent,
    RolComponent,
    FormComponent,
    RolCreatedComponent,
    FormRolComponent,
    RolEditComponent,
    FormPermissionComponent,
    FormEditPermissionComponent,
    PermissionCreatedComponent,
    PermissionEditComponent,
    PermissionComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
