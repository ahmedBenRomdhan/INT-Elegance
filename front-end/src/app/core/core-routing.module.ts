import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListRoleComponent } from './role/list-role/list-role.component';
import { ListUserComponent } from './user/list-user/list-user.component';
import { AuthGuard } from '../guards/auth.guard';
import { HasPermissionGuard } from '../guards/has-permission.guard';
import { ProfileUserComponent } from './user/profile-user/profile-user.component';
import { TrailUserComponent } from './user/trail-user/trail-user.component';
import { editUserProfilePermission, listRolesPermission, listUsersPermission, trailUsersPermission } from '../utils/permissions';

export const routes: Routes = [
  {
    path: 'roles',
    component: ListRoleComponent,
    canActivate: [AuthGuard, HasPermissionGuard],
    data: {
      permission: listRolesPermission,
      title: 'Liste roles',
    },
  },

  {
    path: 'list', component: ListUserComponent,
    canActivate: [AuthGuard, HasPermissionGuard],
    data: {
      permission: listUsersPermission,
      title: 'Liste utilisateurs',
    }
  },
  {
    path: 'profile', component: ProfileUserComponent,
    canActivate: [AuthGuard, HasPermissionGuard],
    data: {
      permission: editUserProfilePermission,
      title: 'Profil',
    }
  },
  {
    path: 'trail', component: TrailUserComponent,
    canActivate: [AuthGuard, HasPermissionGuard],
    data: {
      permission: trailUsersPermission,
      title: 'Historique',
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
