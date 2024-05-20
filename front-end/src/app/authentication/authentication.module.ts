import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptor } from './interceptors/auth.interceptor'
import {
  MatIconModule
} from '@angular/material/icon';
import {
  MatCardModule,
} from '@angular/material/card';
import {
  MatInputModule
} from '@angular/material/input';
import {
  MatCheckboxModule
} from '@angular/material/checkbox';
import {
  MatButtonModule
} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { RouterModule } from '@angular/router';
// import { AuthenticationRoutes } from './authentication.routing';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  declarations: [LoginComponent, ForgotComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]
})
export class AuthenticationModule { }
