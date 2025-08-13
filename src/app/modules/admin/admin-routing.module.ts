import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponentComponent } from '../../shared/components/dashboard-layout-component/dashboard-layout-component.component';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { FormComponent } from './pages/Security/form/form.component';
import { RolComponent } from './pages/Security/rol/rol.component';
import { PermissionComponent } from './pages/Security/permission/permission.component';
import { UserComponent } from './pages/Security/user/user.component';
import { ModuleComponent } from './pages/Security/module/module.component';
import { UserRoleManagementComponent } from './pages/Security/user-role-management/user-role-management.component';
import { PermissionManagementComponent } from './pages/Security/permission-management/permission-management.component';
import { PerfilComponent } from './pages/doctor1/perfil/perfil.component';
import { BranchComponent } from '../parameter/pages/branch/branch.component';
import { CityComponent } from '../parameter/pages/city/city.component';
import { DepartamentComponent } from '../parameter/pages/departament/departament.component';
import { InstitutionsComponent } from '../parameter/pages/institutions/institutions.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponentComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardAdminComponent },

      {path:'doctor',component: DoctorComponent},
      {path:'security/permission',component: PermissionComponent},
      {path:'security/rol',component: RolComponent},
      {path:'security/user',component: UserComponent},
      {path:'security/module',component: ModuleComponent},
      {path:'security/gestion/:id',component: UserRoleManagementComponent},
      {path:'security/gesper',component: PermissionManagementComponent},



      { path: 'doctor', component: DoctorComponent },
      { path: 'doctor1/perfil', component: PerfilComponent },
      { path: 'security/form', component: FormComponent },
    
    { path: 'city', component: CityComponent },
          { path: 'institutions', component: InstitutionsComponent },
          { path: 'branch', component: BranchComponent },
          { path: 'departament', component: DepartamentComponent },
    
    
    
    ]}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
