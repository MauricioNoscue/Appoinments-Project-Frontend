import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
// Agrega más según necesites

const materialModules = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatDividerModule
];

@NgModule({
  imports: materialModules,
  exports: materialModules
})
export class MaterialModule {}
