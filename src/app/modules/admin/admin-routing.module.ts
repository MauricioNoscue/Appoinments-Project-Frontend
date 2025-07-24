import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponentComponent } from '../../shared/components/dashboard-layout-component/dashboard-layout-component.component';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { DoctorComponent } from './pages/doctor/doctor.component';

const routes: Routes = [

  {
    path: '',
    component: DashboardLayoutComponentComponent, // Usa el layout
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardAdminComponent },
      {path:'doctor',component: DoctorComponent}
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
