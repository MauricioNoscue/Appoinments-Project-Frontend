import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorRoutingModule } from './doctor-routing.module';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';
import { HistoryCitationsComponent } from './pages/history-citations/history-citations.component';
import { CitationDetailsDialogComponent } from './pages/history-citations/citation-details-dialog/citation-details-dialog.component';
import { DoctorAgendaComponent } from './pages/doctor-agenda/doctor-agenda.component';



@NgModule({
  declarations: [
    PerfilComponent,
    DashboardComponent,
    HistoryCitationsComponent,
    CitationDetailsDialogComponent,
    DoctorAgendaComponent
  ],
  imports: [CommonModule, DoctorRoutingModule,MaterialModule,SharedModule],
})
export class DoctorModule {}
