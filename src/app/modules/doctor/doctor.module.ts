import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorRoutingModule } from './doctor-routing.module';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    PerfilComponent,
    DashboardComponent,
  ],
  imports: [CommonModule, DoctorRoutingModule,MaterialModule,SharedModule],
})
export class DoctorModule {}
