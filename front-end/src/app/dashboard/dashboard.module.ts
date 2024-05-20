import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';
import { TrackerListProjectsComponent } from './dashboard-components/tracker-list-projects/tracker-list-projects.component';
import { TranslateModule } from '@ngx-translate/core';
import { DemoMaterialModule } from '../demo-material-module';
import {BarChartModule, PieChartModule, LineChartModule} from '@swimlane/ngx-charts';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ListUsersComponent } from './dashboard-components/list-users/list-users.component';
import { ProgressTasksProjectComponent } from './dashboard-components/progress-tasks-project/progress-tasks-project.component';
import { CardsProjectComponent } from './dashboard-components/cards-project/cards-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressUsersProjectComponent } from './dashboard-components/progress-users-project/progress-users-project.component';
import { DepartmentListUsersComponent } from './dashboard-components/department-list-users/department-list-users.component';
import { StatusListProjectsComponent } from './dashboard-components/status-list-projects/status-list-projects.component';
import { CardsGeneralStatisticsComponent } from './dashboard-components/cards-general-statistics/cards-general-statistics.component';
import { CardsUserStatisticsComponent } from './dashboard-components/cards-user-statistics/cards-user-statistics.component';

@NgModule({
  declarations: [HomeDashboardComponent, TrackerListProjectsComponent, ListUsersComponent, ProgressTasksProjectComponent, CardsProjectComponent, ProgressUsersProjectComponent, DepartmentListUsersComponent, StatusListProjectsComponent, CardsGeneralStatisticsComponent, CardsUserStatisticsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DemoMaterialModule,
    BarChartModule,
    PieChartModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    LineChartModule,
    TranslateModule

  ]
})
export class DashboardModule { }
