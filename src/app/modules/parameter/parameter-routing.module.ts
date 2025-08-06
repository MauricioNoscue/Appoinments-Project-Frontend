import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponentComponent } from '../../shared/components/dashboard-layout-component/dashboard-layout-component.component';
import { ParameterDashboardComponent } from './pages/parameter-dashboard/parameter-dashboard.component';
import { CityComponent } from './pages/city/city.component';
import { InstitutionsComponent } from './pages/institutions/institutions.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponentComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ParameterDashboardComponent },
      { path: 'city', component: CityComponent },
      { path: 'institutions', component: InstitutionsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParameterRoutingModule { }
