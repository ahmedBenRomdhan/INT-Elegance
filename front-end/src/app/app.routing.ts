import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './guards/auth.guard';
import { Page404Component } from './page404/page404.component';
import { HomeDashboardComponent } from './dashboard/home-dashboard/home-dashboard.component';
import { ListMeetingComponent } from './meetings-calendar/meeting/list-meeting/list-meeting.component';
import { HasPermissionGuard } from './guards/has-permission.guard';
import { chatPermission, listMeetingsPermission, listProjectsPermission, showDashboardPermission } from './utils/permissions';
import { ListProjectComponent } from './project/project/list-project/list-project.component';
import { ChatComponent } from './apps/chat/chat.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullComponent,
    // canActivate:[AuthGuard],

    children: [
      {
        path: 'dashboard',
        component: HomeDashboardComponent,
        canActivate: [AuthGuard, HasPermissionGuard],
        data: {
          permission: showDashboardPermission,
        },
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./core/core.module').then((m) => m.CoreModule),
      },
      {
        path: 'project',
        loadChildren: () =>
          import('./project/project.module').then((m) => m.ProjectModule),
      },
      {
        path: 'list_projects', component: ListProjectComponent,
        canActivate: [AuthGuard, HasPermissionGuard],
        data: {
          permission: listProjectsPermission,
          title: 'Liste projets',
        },
      },
      {
        path: 'material',
        loadChildren: () =>
          import('./material-component/material.module').then(
            (m) => m.MaterialComponentsModule
          ),
      },
      {
        path: 'meeting',
        component: ListMeetingComponent,
        canActivate: [AuthGuard, HasPermissionGuard],
        data: {
          permission: listMeetingsPermission,
        },
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('./meetings-calendar/meetings-calendar.module').then(
            (m) => m.MeetingsCalendarModule
          ),
      },

      {
        path: 'chat',
        component: ChatComponent,
        canActivate: [AuthGuard, HasPermissionGuard],
        data: {
          permission: chatPermission,
        },
      },
    ],
  },
  {
    path: '**',
    component: Page404Component
  }
];
