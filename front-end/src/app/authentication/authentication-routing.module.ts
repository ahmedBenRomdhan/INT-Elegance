import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotComponent } from './forgot/forgot.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path:'forgot', component:ForgotComponent},
  {path:'reset/:id/:token', component: ResetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
