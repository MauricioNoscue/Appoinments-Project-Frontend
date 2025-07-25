import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponentComponent } from '../../shared/components/dashboard-layout-component/dashboard-layout-component.component';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { FormComponent } from './pages/Security/form/form.component';
import { RolComponent } from './pages/Security/rol/rol.component';
import { PermissionComponent } from './pages/Security/permission/permission.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponentComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: 'doctor', component: DoctorComponent },
      { path: 'security/form', component: FormComponent },
      { path: 'security/rol', component: RolComponent },
      { path: 'security/permission', component: PermissionComponent },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
