import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ContainerComponent } from './container/container.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './Pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Pages/reset-password/reset-password.component';


@NgModule({
  declarations: [ContainerComponent,LoginComponent,RegisterComponent,ForgotPasswordComponent,ResetPasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,ReactiveFormsModule,CommonModule
  ]
})
export class AuthModule { }
