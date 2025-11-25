import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorRoutingModule } from './doctor-routing.module';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';
import { HistoryCitationsComponent } from './pages/history-citations/history-citations.component';
import { CitationDetailsDialogComponent } from './pages/history-citations/citation-details-dialog/citation-details-dialog.component';
import { DoctorAppointmentsComponent } from './pages/doctor-appointments/doctor-appointments.component';
import { ConfirmAttendanceDialogComponent } from './pages/dialogs/confirm-attendance/confirm-attendance.dialog';
import { ClinicalNotesDialogComponent } from './pages/dialogs/clinical-notes/clinical-notes.dialog';
import { DoctorAgendaComponent } from './pages/doctor-agenda/doctor-agenda.component';
import { RequestDoctorComponent } from './pages/request-doctor/request-doctor.component';
import { RequestDoctorDetailsComponent } from './pages/request-doctor/request-doctor-details/request-doctor-details.component';
import { RequestDoctorCreateComponent } from './pages/request-doctor/request-doctor-create/request-doctor-create.component';



@NgModule({
  declarations: [
    PerfilComponent,
    DashboardComponent,
    HistoryCitationsComponent,
    CitationDetailsDialogComponent,
    DoctorAgendaComponent,
    DoctorAppointmentsComponent,
    ConfirmAttendanceDialogComponent,
    ClinicalNotesDialogComponent,RequestDoctorComponent,RequestDoctorDetailsComponent,RequestDoctorCreateComponent
  ],
  imports: [CommonModule, DoctorRoutingModule,MaterialModule,SharedModule],
})
export class DoctorModule {}
