import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { addEventButton, createdByColumn, dateColumn, endTimeColumn, meetingsCard, participantsColumn, roomColumn, searchMeetingPlaceholder, showCalendarButton, startTimeColumn, titleColumn } from '../../utils/variables';
import { actionColumn, noDataFound } from 'src/app/utils/variables';
import { Meeting } from '../../model/meeting';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import { UserDetailsComponent } from 'src/app/core/user/user-details/user-details.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMeetingComponent } from '../delete-meeting/delete-meeting.component';
import { EditMeetingComponent } from '../edit-meeting/edit-meeting.component';
import { User } from 'src/app/authentication/user.model';
import { AddMeetingComponent } from '../add-meeting/add-meeting.component';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { CustomTimePipe } from 'src/app/common/pipes/time.pipe';
import { showCalendarsPermission, addMeetingsPermission, editMeetingsPermission, deleteMeetingsPermission, getUserPermission } from 'src/app/utils/permissions';

@Component({
  selector: 'app-list-meeting',
  templateUrl: './list-meeting.component.html',
  styleUrls: ['./list-meeting.component.scss'],

})
export class ListMeetingComponent implements OnInit {

  meetingsCard = meetingsCard
  createdByColumn = createdByColumn
  titleColumn = titleColumn
  roomColumn = roomColumn
  dateColumn = dateColumn
  startTimeColumn = startTimeColumn
  endTimeColumn = endTimeColumn
  participantsColumn = participantsColumn
  actionColumn = actionColumn

  searchMeetingPlaceholder = searchMeetingPlaceholder

  addButton = addEventButton

  createdMeeting: User = Object.create(null)
  meetings: Meeting[] = []

  showCalendarButton = showCalendarButton
  dataSource!: MatTableDataSource<Meeting>;
  displayedColumns = ['createdBy', 'title', 'room', 'date', 'startTime', 'endTime', 'participants', 'action'];

  showCalendarsPermission = showCalendarsPermission
  addMeetingsPermission = addMeetingsPermission
  editMeetingsPermission = editMeetingsPermission
  deleteMeetingsPermission = deleteMeetingsPermission
  getUserPermission = getUserPermission

  noDataFound = noDataFound

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  constructor(private dataService: DataService, public dialog: MatDialog, private authServ: AuthenticationService,) {
    this.getMeetingsList()
  }

  ngOnInit(): void { }

  getMeetingsList() {
    // @ts-ignore
    this.dataService.getCollection(new Meeting(), "/incoming")
      .pipe()
      .subscribe(
        // @ts-ignore
        (response) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.meetings = response;
            console.log(this.meetings);

            this.dataSource = new MatTableDataSource(this.meetings);
            this.dataSource.paginator = this.paginator;
          }
        });
  }

  openProfileDialog(user: any) {
    if (this.hasPermission(getUserPermission)) {
      const dialogRef = this.dialog.open(UserDetailsComponent, {
        width: '40%',
        data: user
      });
      dialogRef.afterClosed().subscribe(result => {
        this.searchInput.nativeElement.value = '';
      })
    }
  }

  openEditDialog(meeting: any) {
    if (!this.check(meeting)) {
      const dialogRef = this.dialog.open(EditMeetingComponent, {
        data: meeting,
        width: '50%',
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getMeetingsList()
        this.searchInput.nativeElement.value = '';
      });
    }
  }

  openDeleteDialog(meeting: any) {
    if (!this.check(meeting)) {
      const dialogRef = this.dialog.open(DeleteMeetingComponent, {
        data: meeting
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getMeetingsList();
        this.searchInput.nativeElement.value = '';

      })
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddMeetingComponent, {
      width: '52%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getMeetingsList()
      this.searchInput.nativeElement.value = '';
    });
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

  hasPermission(path: string, meeting?: any): boolean {
    const user = this.authServ.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)
    if (permissions.includes(path))
      return true
    else return false
  }
}
