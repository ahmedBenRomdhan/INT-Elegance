import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { DetailsProjectComponent } from './project/details-project/details-project.component';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { EditTaskComponent } from './task/edit-task/edit-task.component';
import { ListTaskComponent } from './task/list-task/list-task.component';
import { ListProjectComponent } from './project/list-project/list-project.component';
import { AuthGuard } from '../guards/auth.guard';
import { HasPermissionGuard } from '../guards/has-permission.guard';
import { BoardPhaseComponent } from './phase/board-phase/board-phase.component';
import { AddChildTaskComponent } from './task/add-child-task/add-child-task.component';
import { TrailTaskComponent } from './task/trail-task/trail-task.component';
import { TrailProjectComponent } from './project/trail-project/trail-project.component';
import { addProjectsPermission, getProjectDetailsPermission, listProjectsPermission, trailProjectPermission, addTasksPermission, addChildTasksPermission, editTasksPermission, trailTasksPermission } from '../utils/permissions';

const routes: Routes = [
  {
    path: 'add', component: AddProjectComponent,
    canActivate: [AuthGuard, HasPermissionGuard],
    data: {
      permission: addProjectsPermission
    },
  },
  {
    path: 'details/:id', component: DetailsProjectComponent,
    canActivate: [AuthGuard, HasPermissionGuard],
    data: {
      permission: getProjectDetailsPermission,
      title: 'Projet détails',
    },
  },
  {
    path: 'trail/:id', component: TrailProjectComponent,
    canActivate: [AuthGuard, HasPermissionGuard],
    data: {
      permission: trailProjectPermission,
      title: 'Historique',
    },
  },
  {
    path: 'phase',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'board/:id', component: BoardPhaseComponent,
        data: {
          title: 'Tableau des tâches',
        },
      }
    ]
  },
  {
    path: 'task',
    children: [
      {
        path: 'add/:id', component: AddTaskComponent,
        canActivate: [AuthGuard, HasPermissionGuard],
        data: {
          permission: addTasksPermission,
        },
      },
      {
        path: 'add-child/:id', component: AddChildTaskComponent,
        canActivate: [AuthGuard, HasPermissionGuard],
        data: {
          permission: addChildTasksPermission,
        },
      },
      {
        path: 'list', component: ListTaskComponent,
        canActivate: [AuthGuard, HasPermissionGuard],
      },
      {
        path: 'edit/:id', component: EditTaskComponent,
        canActivate: [AuthGuard, HasPermissionGuard],
        data: {
          permission: editTasksPermission,
        }, 
      },
      {
        path: 'trail/:id', component: TrailTaskComponent,
        canActivate: [AuthGuard, HasPermissionGuard],
        data: {
          permission: trailTasksPermission,
        },
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
