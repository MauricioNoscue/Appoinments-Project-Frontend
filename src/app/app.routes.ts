import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'inicio',
    loadChildren: () =>
      import('./modules/inicio/inicio.module').then(m => m.InicioModule)
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },






  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];
