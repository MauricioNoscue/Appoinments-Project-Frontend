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
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { SectionCardComponent } from './components/Cards/section-card/section-card.component';
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
  MatListModule,
  MatExpansionModule,
  MatRippleModule,
  MatTooltipModule,
  MatDividerModule,
  MatChipsModule,
  CommonModule,
  FormsModule,
  MatFormFieldModule,
  MatCardModule,
  MatTableModule,
  MatDialogModule,
  ReactiveFormsModule,MatSelectModule ,MatProgressSpinnerModule,MatTabsModule
];

@NgModule({
  imports: materialModules,
  exports: materialModules
})
export class MaterialModule {}
