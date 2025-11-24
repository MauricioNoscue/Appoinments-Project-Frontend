import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { ResetPasswordComponent } from './Pages/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './Pages/forgot-password/forgot-password.component';
import { Verify2FAComponent } from './Pages/verify2-fa/verify2-fa.component';

const routes: Routes = [
    {
      path: '',
      component: ContainerComponent, 
      children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: LoginComponent },
        {path:'register',component: RegisterComponent},
        {path:'reset-password',component: ResetPasswordComponent},
        {path:'forgot-password',component: ForgotPasswordComponent},
        {
  path: 'verify-2fa',
  component: Verify2FAComponent
}

      ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
