import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponentComponent } from '../../shared/components/dashboard-layout-component/dashboard-layout-component.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RelacionPersonaComponent } from './pages/relacion-persona/relacion-persona.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { MiCitasComponent } from './pages/mi-citas/mi-citas.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { ReservationViewComponent } from '../../shared/components/PagesShared/reservation-view/reservation-view.component';
import { authGuard } from '../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponentComponent,
     canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'relacion', component: RelacionPersonaComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'notificaciones', component: NotificacionesComponent },
      { path: 'micitas', component: MiCitasComponent },
      { path: 'agendar', component: ReservationComponent },
       {path:'CitationAviable/:id', component: ReservationViewComponent},

      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
