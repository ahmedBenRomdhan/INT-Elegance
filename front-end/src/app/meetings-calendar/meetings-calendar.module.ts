import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MeetingsCalendarRoutingModule } from './meetings-calendar-routing.module';
import { AddMeetingComponent } from './meeting/add-meeting/add-meeting.component';
import { ListMeetingComponent } from './meeting/list-meeting/list-meeting.component';
import { EditMeetingComponent } from './meeting/edit-meeting/edit-meeting.component';
import { DeleteMeetingComponent } from './meeting/delete-meeting/delete-meeting.component';
import { FullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { DemoMaterialModule } from '../demo-material-module';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CustomTimePipe } from '../common/pipes/time.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CustomTimePipe, AddMeetingComponent, ListMeetingComponent, EditMeetingComponent, DeleteMeetingComponent, FullcalendarComponent],
  imports: [
    CommonModule,
    MeetingsCalendarRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    DemoMaterialModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PerfectScrollbarModule,
    MatDialogModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TranslateModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  providers: [DatePipe]
})
export class MeetingsCalendarModule { }
