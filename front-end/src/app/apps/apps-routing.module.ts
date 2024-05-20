import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

import { HasPermissionGuard } from '../guards/has-permission.guard';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule { }
