import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { BadInput } from 'src/app/common/errors/bad-input';
import { DataService } from 'src/app/services/data.service';
import { cancelButton, editButton, matTooltipClose } from 'src/app/utils/variables';
import Swal from 'sweetalert2';
import { titlePlaceholder, roomLabel, startTimeLabel, endTimeLabel, participantsLabel, requiredTitleError, minLengthTitleError, requiredDateError, requiredRoomError, requiredStartTimeError, requiredEndTimeError, editMeetingCard, editMeetingMessage, endDateLabel, StartDateLabel, descriptionPlaceholder, errorEndTimeMessage } from '../../utils/variables';
import { AddMeetingComponent } from '../add-meeting/add-meeting.component';
import { User } from 'src/app/core/user/model/user';
import { Meeting } from '../../model/meeting';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, MY_DATE_FORMATS } from '../../../utils/format-date';
import { Room } from '../../model/room';

@Component({
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.component.html',
  styleUrls: ['./edit-meeting.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, // Change the locale if necessary
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class EditMeetingComponent implements OnInit {

  editMeetingCard = editMeetingCard
  meetingForm: FormGroup = Object.create(null);
  usersList: User[] = [];
  rooms: Room[] = []

  editButton = editButton
  cancelButton = cancelButton
  matTooltipClose = matTooltipClose

  titlePlaceholder = titlePlaceholder
  roomLabel = roomLabel
  startTimeLabel = startTimeLabel
  endTimeLabel = endTimeLabel
  participantsLabel = participantsLabel
  StartDateLabel = StartDateLabel
  endDateLabel = endDateLabel
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
  minDateError = false
  errorEndTimeMessage = errorEndTimeMessage
  errorEndDate = false

  selectedValue: string[] = []

  constructor(
    public dialogRef: MatDialogRef<AddMeetingComponent>,
    private formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
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
      });
    this.getRoomsList()
    this.getUsersList();

    if (this.data) {
      this.meetingForm.controls['title'].setValue(this.data.title)      
      this.meetingForm.controls['roomId'].setValue(this.data.roomId)
      this.meetingForm.controls['start'].setValue(this.data.start)
      this.meetingForm.controls['end'].setValue(this.data.end)
      this.meetingForm.controls['startTime'].setValue(this.data.startTime)
      this.meetingForm.controls['endTime'].setValue(this.data.endTime)
      this.data.users.forEach((element: any) => {
        this.selectedValue.push(element.id)
      });
      this.meetingForm.controls['users'].setValue(this.selectedValue)
      this.meetingForm.controls['description'].setValue(this.data.description)

    }
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
      // @ts-ignore
      const meetingModel = new Meeting();
      meetingModel.setId(this.data.id);

      let meeting = {
        title: this.meetingForm.value.title,
        start: this.meetingForm.value.start,
        end: this.meetingForm.value.end,
        roomId: this.meetingForm.value.roomId,
        startTime: this.meetingForm.value.startTime,
        endTime: this.meetingForm.value.endTime,
        users: this.meetingForm.value.users,
        createdBy: this.data.createdBy,
      };

      // @ts-ignore
      this.dataService.putItem(meetingModel, '/edit', meeting)
        .pipe()
        .subscribe({
          next: (res: any) => {
            this.closeDialog()
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              width: 450,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: editMeetingMessage
            })
          }
        })
    } else {
      // @ts-ignore
      Functions.validateOnSubmit(this.meetingForm);
    }
  }

  checkDate() {
    const startDateValue = new Date(this.meetingForm.value.start);
    startDateValue.setHours(0, 0, 0, 0);

    const minStartDateValue = new Date(this.minStartDate);
    minStartDateValue.setHours(0, 0, 0, 0);

    if (this.meetingForm.value.end != null)
      this.maxStartDate = this.meetingForm.value.end

    if (this.meetingForm.value.start != null) {
      if (startDateValue < minStartDateValue)
        this.minDateError = true
      else
        this.minDateError = false

      this.minEndDate = this.meetingForm.value.start
    }

    if (this.meetingForm.value.end != null && this.meetingForm.value.start != null) {

      if (startDateValue < minStartDateValue) {
        this.minDateError = true;
      }

      if (this.meetingForm.value.start > this.maxStartDate) {
        this.errorEndDate = true
      }
      else {
        this.minDateError = false
        this.errorEndDate = false
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

