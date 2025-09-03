// modules/paciente/paciente.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteRoutingModule } from './paciente-routing.module';

// importa SharedModule si el layout NO es standalone
import { SharedModule } from '../../shared/shared.module';
import { MatCard } from '@angular/material/card';
import { MaterialModule } from '../../shared/material.module';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { EditProfileSectionDialogComponent } from './pages/perfil/edit-profile-section-dialog/edit-profile-section-dialog.component';

@NgModule({
  declarations: [PerfilComponent, EditProfileSectionDialogComponent], // NO declares DashboardComponent (es standalone)
  imports: [
    CommonModule,
    PacienteRoutingModule,
    SharedModule, // <-- vuelve a ponerlo si el layout se declara allí
    MatCard,
    MaterialModule,
  ],
})
export class PacienteModule {}
