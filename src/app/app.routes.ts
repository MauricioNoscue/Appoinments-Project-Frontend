import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'inicio',
    loadChildren: () =>
      import('./modules/inicio/inicio.module').then(m => m.InicioModule)
  },

   {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then(m => m.AdminModule)
  },





  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];
