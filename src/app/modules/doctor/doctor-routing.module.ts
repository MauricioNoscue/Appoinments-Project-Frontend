import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponentComponent } from '../../shared/components/dashboard-layout-component/dashboard-layout-component.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoryCitationsComponent } from './pages/history-citations/history-citations.component';
import { DoctorAgendaComponent } from './pages/doctor-agenda/doctor-agenda.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponentComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'historial', component: HistoryCitationsComponent },
      { path: 'pendientes', component: DoctorAgendaComponent }  // Nueva ruta para DoctorAgendaComponent
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
