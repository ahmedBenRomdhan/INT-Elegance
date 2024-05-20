import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/user/model/user';
import { addMeetingCard, addMeetingMessage, StartDateLabel, endTimeLabel, minLengthTitleError, participantsLabel, requiredDateError, requiredEndTimeError, requiredRoomError, requiredStartTimeError, requiredTitleError, roomLabel, startTimeLabel, titlePlaceholder, endDateLabel, errorEndTimeMessage, descriptionPlaceholder, noAvailableRoom, errorCurrentTimeMessage } from '../../utils/variables';
import { addButton, cancelButton, matTooltipClose } from 'src/app/utils/variables';
import { BadInput } from 'src/app/common/errors/bad-input';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { Meeting } from '../../model/meeting';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, MY_DATE_FORMATS } from '../../../utils/format-date';
import { Room } from '../../model/room';

@Component({
  selector: 'app-add-meeting',
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class AddMeetingComponent implements OnInit {
  addMeetingCard = addMeetingCard
  meetingForm: FormGroup = Object.create(null);
  usersList: User[] = [];
  rooms: Room[] = []

  addButton = addButton
  cancelButton = cancelButton
  matTooltipClose = matTooltipClose

  titlePlaceholder = titlePlaceholder
  roomLabel = roomLabel
  StartDateLabel = StartDateLabel
  endDateLabel = endDateLabel
  startTimeLabel = startTimeLabel
  endTimeLabel = endTimeLabel
  participantsLabel = participantsLabel
  descriptionPlaceholder = descriptionPlaceholder

  requiredTitleError = requiredTitleError
  minLengthTitleError = minLengthTitleError
  requiredDateError = requiredDateError
  requiredRoomError = requiredRoomError
  requiredStartTimeError = requiredStartTimeError
  requiredEndTimeError = requiredEndTimeError

  minEndDate: Date;
  maxStartDate: any
  minStartDate: Date;
  errorEndTimeMessage = errorEndTimeMessage

  startDateChanged: string | null = ""
  endDateChanged: string | null = ""
  isRoomSelectDisabled: boolean = true;
  noAvailableRoom = noAvailableRoom
  errorCurrentTimeMessage = errorCurrentTimeMessage

  constructor(
    public dialogRef: MatDialogRef<AddMeetingComponent>,
    private formBuilder: FormBuilder,
    private dataService: DataService, private authService: AuthenticationService) {
    this.minStartDate = new Date();
    this.minEndDate = new Date();
  }

  ngOnInit(): void {
    this.meetingForm = this.formBuilder.group(
      {
        title: [null, [Validators.required, Validators.minLength(3)]],
        roomId: [null, Validators.required],
        start: [null, Validators.required],
        end: [null, Validators.required],
        startTime: [null, Validators.required],
        endTime: [null, Validators.required],
        users: null,
        description: null
      },
    );
    this.getRoomsList()
    this.getUsersList();
  }

  getUsersList() {
    // @ts-ignore
    this.dataService.getCollection(new User(), '/active')
      .pipe()
      .subscribe(
        (response: { usersList: any; }) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.usersList = response;
          }
        });
  }

  getRoomsList() {
    // @ts-ignore
    this.dataService.getCollection(new Room(), null)
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.rooms = response;
          }
        });
  }

  submit() {
    const Toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    if (this.meetingForm.valid) {
      let meeting = {
        title: this.meetingForm.value.title,
        start: this.meetingForm.value.start,
        end: this.meetingForm.value.end,
        roomId: this.meetingForm.value.roomId,
        startTime: this.meetingForm.value.startTime,
        endTime: this.meetingForm.value.endTime,
        users: this.meetingForm.value.users,
        createdBy: this.authService.getUser().id,
      };

      // @ts-ignore
      this.dataService.postItem(new Meeting(), '/add', meeting)
        .pipe()
        .subscribe({
          next: (res) => {
            this.closeDialog();
            Toast.fire({
              icon: 'success',
              title: addMeetingMessage,
              position: 'top-end',
              width: 400,
            })
          },
          error: () => {
            Toast.fire({
              icon: 'error',
              text: BadInput.message,
              position: 'bottom',
              width: 600,
            })
          }
        })
    } else {
      // @ts-ignore
      Functions.validateOnSubmit(this.meetingForm);
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  checkDate() {
    if (this.meetingForm.value.end != null)
      this.maxStartDate = this.meetingForm.value.end

    if (this.meetingForm.value.start != null)
      this.minEndDate = this.meetingForm.value.start

  }

  chooseRoom() {
    if (this.meetingForm.value.startTime && this.meetingForm.value.endTime) {
      if (this.meetingForm.value.endTime <= this.meetingForm.value.startTime)
        this.meetingForm.controls['endTime'].setErrors({ 'error_endtime': true });
    }

    if (this.meetingForm.value.start && this.meetingForm.value.end && this.meetingForm.value.startTime) {
      const startDateValue = new Date(this.meetingForm.value.start);
      const endDateValue = new Date(this.meetingForm.value.end);

      if (startDateValue.toDateString() === endDateValue.toDateString()) {
        const fieldStartTimeParts = this.meetingForm.value.startTime.split(":");
        startDateValue.setHours(Number(fieldStartTimeParts[0]));
        startDateValue.setMinutes(Number(fieldStartTimeParts[1]));
        if (startDateValue < new Date())
          this.meetingForm.controls['startTime'].setErrors({ 'error_time': true });
      }
      if (this.meetingForm.value.endTime) {
        this.isRoomSelectDisabled = false;

        const fieldEndTimeParts = this.meetingForm.value.endTime.split(":");
        endDateValue.setHours(Number(fieldEndTimeParts[0]));
        endDateValue.setMinutes(Number(fieldEndTimeParts[1]));

        if (endDateValue < new Date())
          this.meetingForm.controls['endTime'].setErrors({ 'error_time': true });

        const localOffset = this.meetingForm.value.start.getTimezoneOffset();
        const adjustedStartDate = new Date(this.meetingForm.value.start.getTime() - (localOffset * 60 * 1000));
        this.startDateChanged = adjustedStartDate.toISOString();

        const adjustedEndDate = new Date(this.meetingForm.value.end.getTime() - (localOffset * 60 * 1000));
        this.endDateChanged = adjustedEndDate.toISOString();

        const formattedStartTime = this.meetingForm.value.startTime + ':00';
        const formattedEndTime = this.meetingForm.value.endTime + ':00';

        // @ts-ignore
        this.dataService.getCollection(new Room(), `/available?startDate=${this.startDateChanged}&&endDate=${this.endDateChanged}&&startTime=${formattedStartTime}&&endTime=${formattedEndTime}`)
          .pipe()
          .subscribe(
            (response) => {
              // @ts-ignore
              if (response) {
                // @ts-ignore
                this.rooms = response;
              }

              if (this.rooms.length == 0) {
                this.meetingForm.controls['roomId'].setValue(null)
              }
            });
      }
    }
    else {
      this.meetingForm.controls['roomId'].setValue(null)
      this.isRoomSelectDisabled = true;
    }
  }
}

