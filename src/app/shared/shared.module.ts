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


const sharedComponents =[
  MobileMenuComponent,
  IconIncioComponent,
  NavLinkComponent,
  ButtonBasicComponent,SidebarComponent,DashboardLayoutComponentComponent,CardBasicComponent,StaffCardComponent

]




@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,
    MaterialModule,RouterModule 
  ],
  exports: [
   sharedComponents,DashboardLayoutComponentComponent
  ]
})
export class SharedModule {}
