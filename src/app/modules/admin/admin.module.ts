import { CardViewModuleComponent } from './Components/cards/card-view-module/card-view-module.component';
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
import { UserComponent } from './pages/Security/user/user.component';
import { ModuleComponent } from './pages/Security/module/module.component';
import { FormModuleComponent } from './Components/forms/FormsBase/form-module/form-module.component';
import { ModuleCreatedComponent } from './Components/forms/FormsCreate/module-created/module-created.component';
import { ModuleEditComponent } from './Components/forms/FormsEdit/module-edit/module-edit.component';
import { FormUserComponent } from './Components/forms/FormsBase/form-user/form-user.component';
import { UserCreateComponent } from './Components/forms/FormsCreate/user-create/user-create.component';
import { UserRoleManagementComponent } from './pages/Security/user-role-management/user-role-management.component';
import { PermissionManagementComponent } from './pages/Security/permission-management/permission-management.component';


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
    UserComponent,
    ModuleComponent,
    FormModuleComponent,
    ModuleCreatedComponent,
    ModuleEditComponent,
    CardViewModuleComponent,
    FormUserComponent,
    UserCreateComponent,UserRoleManagementComponent,PermissionManagementComponent
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