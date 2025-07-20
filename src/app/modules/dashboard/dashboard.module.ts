import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { AdminComponent } from './Pages/admin/admin.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';


@NgModule({
  declarations: [AdminComponent,SidebarComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,MaterialModule
  ]
})
export class DashboardModule { }
