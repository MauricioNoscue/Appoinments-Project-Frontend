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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolCreatedComponent } from './Components/forms/FormsCreate/rol-created/rol-created.component';
import { FormRolComponent } from './Components/forms/FormsBase/form-rol/form-rol.component';
import { RolEditComponent } from './Components/forms/FormsEdit/rol-edit/rol-edit.component';
import { FormPermissionComponent } from './Components/forms/FormsBase/form-permission/form-permission.component';
import { FormEditPermissionComponent } from './Components/forms/FormsEdit/form-edit-permission/form-edit-permission.component';
import { PermissionCreatedComponent } from './Components/forms/FormsCreate/permission-created/permission-created.component';
import { PermissionEditComponent } from './Components/forms/FormsEdit/permission-edit/permission-edit.component';
import { PermissionComponent } from './pages/Security/permission/permission.component';
import { UserComponent } from './pages/Security/user/user.component';
import { ModuleComponent } from './pages/Security/module/module.component';
import { FormModuleComponent } from './Components/forms/FormsBase/form-module/form-module.component';
import { ModuleCreatedComponent } from './Components/forms/FormsCreate/module-created/module-created.component';
import { ModuleEditComponent } from './Components/forms/FormsEdit/module-edit/module-edit.component';
import { FormUserComponent } from './Components/forms/FormsBase/form-user/form-user.component';
import { FormDoctorComponent } from './Components/forms/FormsBase/form-doctor/form-doctor.component';
import { UserCreateComponent } from './Components/forms/FormsCreate/user-create/user-create.component';
import { UserRoleManagementComponent } from './pages/Security/user-role-management/user-role-management.component';
import { PermissionManagementComponent } from './pages/Security/permission-management/permission-management.component';
import { PerfilComponent } from './pages/doctor1/perfil/perfil.component';
import { ConsultorioComponent } from './pages/consultorio/consultorio.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TypeCitationManagementComponent } from './pages/type-citation-management/type-citation-management.component';
import { ViewCitationAvailableComponent } from './pages/view-citation-available/view-citation-available.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { MatDialogContent } from '@angular/material/dialog';
import { DoctorFormDialogComponent } from './pages/medical-staff/dialogs/doctor-form-dialog/doctor-form-dialog.component';
import { DoctorCardComponent } from './Components/cards/doctor-card/doctor-card.component';
import { MedicalStaffComponent } from './pages/medical-staff/medical-staff/medical-staff.component';
import { DoctorCreatedDialogComponent } from './pages/medical-staff/dialogs/doctor-created-dialog/doctor-created-dialog.component';
import { DashboardComponent } from './pages/doctor1/dashboard/dashboard.component';
import { DatePipe, DecimalPipe } from '@angular/common';


@NgModule({
  declarations: [
    DashboardAdminComponent,
    DoctorComponent,
    PerfilComponent,
    DashboardComponent,
    RolComponent,
    FormComponent,
    RolCreatedComponent,
    // FormRolComponent,
    RolEditComponent,
    // FormPermissionComponent,
    FormEditPermissionComponent,
    // PermissionCreatedComponent,
    PermissionEditComponent,
    PermissionComponent,
    UserComponent,
    ModuleComponent,
    // FormModuleComponent,
    ModuleCreatedComponent,
    ModuleEditComponent,
    CardViewModuleComponent,
    FormUserComponent,
    FormDoctorComponent,
    UserCreateComponent,
    UserRoleManagementComponent,
    PermissionManagementComponent,
    ConsultorioComponent,TypeCitationManagementComponent,ViewCitationAvailableComponent,ScheduleComponent,
    DoctorCardComponent,
    DoctorFormDialogComponent,
    DoctorCardComponent,
    MedicalStaffComponent,
    ConsultorioComponent,
    TypeCitationManagementComponent,
    ViewCitationAvailableComponent,
    DoctorCreatedDialogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDialogContent,
    DatePipe,
    DecimalPipe
  ],
})
export class AdminModule {}
