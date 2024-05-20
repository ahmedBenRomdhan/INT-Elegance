import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { AuthGuard } from '../guards/auth.guard';
import { HasPermissionGuard } from '../guards/has-permission.guard';
import { showCalendarsPermission } from '../utils/permissions';

const routes: Routes = [
  {
    path: 'details', component: FullcalendarComponent,
    canActivate: [AuthGuard,HasPermissionGuard],
    data: {
      permission: showCalendarsPermission,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsCalendarRoutingModule { }
