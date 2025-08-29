import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponentComponent } from '../../shared/components/dashboard-layout-component/dashboard-layout-component.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RelacionPersonaComponent } from './pages/relacion-persona/relacion-persona.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponentComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'relacion', component: RelacionPersonaComponent },
      { path: 'perfil', component: PerfilComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
