import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { User } from 'src/app/core/user/model/user';
import { Project } from '../model/project';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { BadInput } from 'src/app/common/errors/bad-input';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, MY_DATE_FORMATS } from '../../../utils/format-date';
import { backlog, errorEndDateMessage, newStatus, otherLabel, otherTasks, othersLabel, types } from 'src/app/project/utils/variables';
import { matTooltipClose, noDataFound } from 'src/app/utils/variables';
import { SocketService } from 'src/app/services/socket.service';
import { Socket } from 'socket.io-client';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class AddProjectComponent implements OnInit {

  projectForm: FormGroup = Object.create(null);
  types: string[] = types
  minStartDate: Date;
  minEndDate: Date;
  maxStartDate: any
  usersList: User[] = [];

  errorEndDateMessage = errorEndDateMessage

  backlog = backlog
  otherTasks = otherTasks
  matTooltipClose = matTooltipClose
  othersLabel = othersLabel
  otherLabel = otherLabel
  noDataFound = noDataFound
  socket: Socket;
  constructor(
    public dialogRef: MatDialogRef<AddProjectComponent>,
    private formBuilder: FormBuilder, private dataService: DataService, private socketService: SocketService
  ) {
    this.minStartDate = new Date();
    this.minEndDate = new Date();
    this.socket = this.socketService.getSocket()
  }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.minLength(3)]],
        description: [null],
        type: [null, Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        users: null,
        status: newStatus,
      });

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

  submit() {
    const Toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    if (this.projectForm.valid) {

      let project = {
        name: this.projectForm.value.name,
        description: this.projectForm.value.description,
        type: this.projectForm.value.type,
        startDate: this.projectForm.value.startDate,
        endDate: this.projectForm.value.endDate,
        users: this.projectForm.value.users,
        status: this.projectForm.value.status,
      };
      // @ts-ignore
      this.dataService.postItem(new Project(), `/add?backlog=${backlog}&otherTasks=${otherTasks}`, project)
        .pipe()
        .subscribe({
          next: (res: any) => {
            this.closeDialog()

            Toast.fire({
              icon: 'success',
              title: 'Projet Ajouté avec Succès.',
              position: 'top-end',
            })
          },
          error: () => {
            Toast.fire({
              icon: 'error',
              text: BadInput.message,
              position: 'bottom',
              width: 470,
            })
          }
        })
    } else {
      // @ts-ignore
      Functions.validateOnSubmit(this.projectForm);
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  checkDate() {
    if (this.projectForm.value.endDate != null)
      this.maxStartDate = this.projectForm.value.endDate

    if (this.projectForm.value.startDate != null)
      this.minEndDate = this.projectForm.value.startDate
  }

}
