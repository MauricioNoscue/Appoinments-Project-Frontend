import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ContainerComponent } from './container/container.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './Pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Pages/reset-password/reset-password.component';
import { Verify2FAComponent } from './Pages/verify2-fa/verify2-fa.component';
import { MaterialModule } from '../../shared/material.module';
import { UnlockRequestComponent } from './Pages/unlock-request/unlock-request.component';


@NgModule({
  declarations: [ContainerComponent,LoginComponent,RegisterComponent,ForgotPasswordComponent,ResetPasswordComponent,Verify2FAComponent,UnlockRequestComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,ReactiveFormsModule,CommonModule,MaterialModule
  ]
})
export class AuthModule { }
