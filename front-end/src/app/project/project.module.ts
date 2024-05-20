import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { EditProjectComponent } from './project/edit-project/edit-project.component';
import { DeleteProjectComponent } from './project/delete-project/delete-project.component';
import { DetailsProjectComponent } from './project/details-project/details-project.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { DemoMaterialModule } from '../demo-material-module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { EditTaskComponent } from './task/edit-task/edit-task.component';
import { DeleteTaskComponent } from './task/delete-task/delete-task.component';
import { ListTaskComponent } from './task/list-task/list-task.component';
import { ListProjectComponent } from './project/list-project/list-project.component';
import { AddPhaseComponent } from './phase/add-phase/add-phase.component';
import { EditPhaseComponent } from './phase/edit-phase/edit-phase.component';
import { DeletePhaseComponent } from './phase/delete-phase/delete-phase.component';
import { ListPhaseComponent } from './phase/list-phase/list-phase.component';

import { BoardPhaseComponent } from './phase/board-phase/board-phase.component';
import { AddUserProjectComponent } from './project/add-user-project/add-user-project.component';
import { AddChildTaskComponent } from './task/add-child-task/add-child-task.component';
import { TrailTaskComponent } from './task/trail-task/trail-task.component';
import { TrailProjectComponent } from './project/trail-project/trail-project.component';
import { UserTaskComponent } from './task/user-task/user-task.component';
import { CancelTaskComponent } from './task/cancel-task/cancel-task.component';

@NgModule({
  declarations: [AddProjectComponent, EditProjectComponent, DeleteProjectComponent, DetailsProjectComponent, AddTaskComponent, EditTaskComponent, DeleteTaskComponent, ListTaskComponent, ListProjectComponent, AddPhaseComponent, EditPhaseComponent, DeletePhaseComponent, ListPhaseComponent, BoardPhaseComponent, AddUserProjectComponent, AddChildTaskComponent, TrailTaskComponent, TrailProjectComponent, UserTaskComponent, CancelTaskComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    FlexLayoutModule,
    DemoMaterialModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    DragDropModule,
    TranslateModule
  ], providers: [DatePipe]

})
export class ProjectModule { }
