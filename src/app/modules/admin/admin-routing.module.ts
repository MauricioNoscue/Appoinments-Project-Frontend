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

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponentComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardAdminComponent },
      {path:'doctor',component: DoctorComponent},
      {path:'security/form',component: FormComponent},
      {path:'security/rol',component: RolComponent},
      {path:'security/permission',component: PermissionComponent},
      {path:'security/user',component: UserComponent},
      {path:'security/module',component: ModuleComponent},






    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
