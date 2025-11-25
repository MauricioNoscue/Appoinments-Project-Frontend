import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponentComponent } from '../../shared/components/dashboard-layout-component/dashboard-layout-component.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoryCitationsComponent } from './pages/history-citations/history-citations.component';
import { DoctorAgendaComponent } from './pages/doctor-agenda/doctor-agenda.component';
import { DoctorAppointmentsComponent } from './pages/doctor-appointments/doctor-appointments.component';
import { authGuard } from '../../../guards/auth.guard';
import { RequestDoctorComponent } from './pages/request-doctor/request-doctor.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponentComponent,
     canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'historial', component: HistoryCitationsComponent },
      { path: 'pendientes', component: DoctorAgendaComponent },  // Nueva ruta para DoctorAgendaComponent
      { path: 'citas/:date', component: DoctorAppointmentsComponent },
      { path: 'request', component: RequestDoctorComponent },

      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
