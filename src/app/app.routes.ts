import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'inicio',
    loadChildren: () =>
      import('./modules/inicio/inicio.module').then(m => m.InicioModule)
  },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];
