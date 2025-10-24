import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParameterRoutingModule } from './parameter-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ParameterDashboardComponent } from './pages/parameter-dashboard/parameter-dashboard.component';
import { CityComponent } from './pages/city/city.component';
import { InstitutionsComponent } from './pages/institutions/institutions.component';
import { BranchComponent } from './pages/branch/branch.component';
import { DepartamentComponent } from './pages/departament/departament.component';

@NgModule({
  declarations: [
    BranchComponent,
    DepartamentComponent,
    InstitutionsComponent,
    CityComponent
  ],
  imports: [
    ParameterRoutingModule,
    SharedModule,
    MaterialModule,
  ],
})
export class ParameterModule {}
