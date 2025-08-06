import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParameterRoutingModule } from './parameter-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ParameterDashboardComponent } from './pages/parameter-dashboard/parameter-dashboard.component';
import { CityComponent } from './pages/city/city.component';
import { InstitutionsComponent } from './pages/institutions/institutions.component';

@NgModule({
  declarations: [
    // Componentes no standalone se declaran aquí
  ],
  imports: [
    CommonModule,
    ParameterRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    ParameterDashboardComponent, // Importamos los componentes standalone
    CityComponent,
    InstitutionsComponent
  ]
})
export class ParameterModule { }
