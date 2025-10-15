import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module'; // <-- importante
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { IconIncioComponent } from './components/icons/icon-incio/icon-incio.component';
import { NavLinkComponent } from './components/NavLinks/nav-link/nav-link.component';
import { ButtonBasicComponent } from './components/button/button-basic/button-basic.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardLayoutComponentComponent } from './components/dashboard-layout-component/dashboard-layout-component.component';
import { RouterModule } from '@angular/router';
import { CardBasicComponent } from './components/Cards/card-basic/card-basic.component';
import { StaffCardComponent } from './components/Cards/staff-card/staff-card.component';
import { DialogContainerComponent } from './components/Modal/dialog-container/dialog-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SectionCardComponent } from './components/Cards/section-card/section-card.component';
import { TypeCitationComponent } from './components/PagesShared/type-citation/type-citation.component';
import { CardTypeCitationComponent } from './components/Cards/card-type-citation/card-type-citation.component';
import { CalendarComponent } from './components/Sections/calendar/calendar.component';
import { SheduleCardComponent } from './components/Cards/shedule-card/shedule-card.component';
import { FormSheduleComponent } from '../modules/admin/Components/forms/form-shedule/form-shedule.component';
import { NotificacionesComponent } from '../modules/paciente/pages/notificaciones/notificaciones.component';
import { MiCitasComponent } from '../modules/paciente/pages/mi-citas/mi-citas.component';
import { ReservationComponent } from '../modules/paciente/pages/reservation/reservation.component';
import { ReservationViewComponent } from './components/PagesShared/reservation-view/reservation-view.component';
import { PerfilComponent } from '../modules/paciente/pages/perfil/perfil.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';


const sharedComponents =[
  MobileMenuComponent,
  IconIncioComponent,
  NavLinkComponent,
  ButtonBasicComponent,
  SidebarComponent,
  DashboardLayoutComponentComponent,
  CardBasicComponent,
  StaffCardComponent,
  DialogContainerComponent,SectionCardComponent
  ,TypeCitationComponent,CardTypeCitationComponent,
  CalendarComponent,
  SheduleCardComponent,
  FormSheduleComponent,
  ReservationViewComponent,
  ToolbarComponent
  
 


]

@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    NotificacionesComponent,
    MiCitasComponent,

  ],
  exports: [sharedComponents, DashboardLayoutComponentComponent],
})
export class SharedModule {}
