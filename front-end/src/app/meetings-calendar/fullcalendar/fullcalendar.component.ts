import {
    Component,
    OnInit,
    Inject,
    ChangeDetectorRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
    MatDialog,
    MatDialogRef,
    MatDialogConfig,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView
} from 'angular-calendar';
import { AddMeetingComponent } from '../meeting/add-meeting/add-meeting.component';
import { addEventButton, calendarCard, meetingsCard } from '../utils/variables';
import { Meeting } from '../model/meeting';
import { DataService } from 'src/app/services/data.service';
import { DeleteMeetingComponent } from '../meeting/delete-meeting/delete-meeting.component';
import { EditMeetingComponent } from '../meeting/edit-meeting/edit-meeting.component';



const colors: any = {
    red: {
        primary: '#fc4b6c',
        secondary: '#f9e7eb'
    },
    blue: {
        primary: '#1e88e5',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#ffb22b',
        secondary: '#FDF1BA'
    }
};

@Component({
    selector: 'app-fullcalendar',
    templateUrl: './fullcalendar.component.html',
    styleUrls: ['./fullcalendar.component.scss']
})
export class FullcalendarComponent implements OnInit {

    lastCloseResult = '';
    actionsAlignment = '';

    view = 'month';
    viewDate: Date = new Date();

    actions: CalendarEventAction[] = [
        {
            label: '<i class="ti-pencil act"></i>',
            onClick: ({ event }: { event: any }): void => {
                this.openEditDialog(event)
            }
        },
        {
            label: '<i class="ti-close act"></i>',
            onClick: ({ event }: { event: any }): void => {
                this.openDeleteDialog(event)
            }
        }
    ];

    refresh: Subject<any> = new Subject();

    events: any[] = [
    ];

    activeDayIsOpen = false;
    addButton = addEventButton
    calendarCardName = calendarCard
    meetings: Meeting[] = []

    constructor(public dialog: MatDialog, @Inject(DOCUMENT) doc: any, private dataService: DataService, private changeDetectorRef: ChangeDetectorRef) { }
    ngOnInit(): void {
        this.changeDetectorRef.detectChanges();
        this.getMeetingsList()
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd
    }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map((iEvent) => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd,
                };
            }
            return iEvent;
        });
    }

    openAddDialog() {
        const dialogRef = this.dialog.open(AddMeetingComponent, {
            width: '50%',
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getMeetingsList()
        });
    }

    setView(view: CalendarView): void {
        this.view = view;
    }

    getMeetingsList() {
        // @ts-ignore
        this.dataService.getCollection(new Meeting(), null)
            .pipe()
            .subscribe(
                // @ts-ignore
                (response) => {
                    // @ts-ignore
                    if (response) {
                        this.events = []
                        // @ts-ignore
                        this.meetings = response;
                        this.meetings.forEach((meet) => {
                            let event: any = {
                                id: meet.id,
                                start: new Date(meet.start),
                                end: new Date(meet.end),
                                startTime: meet.startTime,
                                endTime: meet.endTime,
                                title: meet.title,
                                color: this.setColor(meet),
                                description: meet.description,
                                roomId: meet.roomId,
                                createdBy: meet.createdBy,
                                users: meet.users,
                            }
                            if (!this.check(meet))
                                event = {
                                    ...event,
                                    actions: this.actions
                                }
                            this.events = [
                                ... this.events,
                                event
                            ]
                        })
                    }
                });
    }

    openEditDialog(meeting: any) {
        const dialogRef = this.dialog.open(EditMeetingComponent, {
            data: meeting,
            width: '50%',
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getMeetingsList()
        });
    }

    openDeleteDialog(meeting: any) {
            const dialogRef = this.dialog.open(DeleteMeetingComponent, {
                data: meeting
            });
            dialogRef.afterClosed().subscribe(result => {
                this.getMeetingsList();
            })
    }

    check(meeting: any): boolean {
        const today = new Date();
        const fieldTimeParts = meeting.startTime.split(":");
        const currentDateTime = new Date(meeting.start);
        currentDateTime.setHours(Number(fieldTimeParts[0]));
        currentDateTime.setMinutes(Number(fieldTimeParts[1]));
        currentDateTime.setSeconds(Number(fieldTimeParts[2]));
        if (currentDateTime <= today)
            return true
        return false
    }

    setColor(meeting: any) {
        const fieldTimeParts = meeting.endTime.split(":");
        const currentDateTime = new Date(meeting.end);
        currentDateTime.setHours(Number(fieldTimeParts[0]));
        currentDateTime.setMinutes(Number(fieldTimeParts[1]));
        currentDateTime.setSeconds(Number(fieldTimeParts[2]));        
        if(currentDateTime < new Date())
           return  colors.blue
        if(this.check(meeting) && currentDateTime > new Date())
            return colors.yellow
        if (!this.check(meeting))
          return colors.red
    }
}
