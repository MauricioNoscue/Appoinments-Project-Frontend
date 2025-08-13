import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'inicio',
    loadChildren: () =>
      import('./modules/inicio/inicio.module').then((m) => m.InicioModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'parameter',
    loadChildren: () =>
      import('./modules/parameter/parameter.module').then(
        (m) => m.ParameterModule
      ),
  },
  {
    path: 'doctor',
    loadChildren: () =>
      import('./modules/doctor/doctor.module').then(
        (m) => m.DoctorModule
      ),
  },

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
];
