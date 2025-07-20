import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
// Agrega más según necesites

const materialModules = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatDividerModule,
  MatSidenavModule, MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatExpansionModule,
  MatRippleModule,
  MatTooltipModule,
  MatDividerModule

];

@NgModule({
  imports: materialModules,
  exports: materialModules
})
export class MaterialModule {}
