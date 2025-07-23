import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from '../../shared/material.module';
import { MobileMenuComponent } from '../../shared/components/mobile-menu/mobile-menu.component';
import { SharedModule } from '../../shared/shared.module';
import { IconIncioComponent } from '../../shared/components/icons/icon-incio/icon-incio.component';
import { BodyComponent } from './components/body/body.component';
import { HomePanelComponent } from './pages/home-panel/home-panel.component';
import { HomeComponent } from './components/sections/home/home.component';
import { ManagementComponent } from './components/sections/management/management.component';
import { AppointmentManagementComponent } from './components/sections/appointment-management-component/appointment-management-component.component';


@NgModule({
  declarations: [

   
    HeaderComponent,
    BodyComponent,
    HomePanelComponent,
    HomeComponent,
    ManagementComponent,AppointmentManagementComponent
    
    
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,MaterialModule,SharedModule
  ]
})
export class InicioModule { }
