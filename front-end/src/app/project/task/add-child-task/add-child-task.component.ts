import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/authentication/user.model';
import { DataService } from 'src/app/services/data.service';
import { Phase } from '../../phase/model/phase';
import { Task } from '../model/task';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, MY_DATE_FORMATS } from '../../../utils/format-date';
import { canceledStatus, completedStatus, inProgressStatus, newStatus, priorities, trackers } from 'src/app/project/utils/variables';
import Swal from 'sweetalert2';
import { BadInput } from 'src/app/common/errors/bad-input';
import { noDataFound } from 'src/app/utils/variables';

@Component({
  selector: 'app-add-child-task',
  templateUrl: './add-child-task.component.html',
  styleUrls: ['./add-child-task.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, // Change the locale if necessary
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class AddChildTaskComponent implements OnInit {
  taskForm: FormGroup = Object.create(null);
  trackers: string[] = trackers;
  priorities: string[] = priorities
  usersList: User[] = [];
  tasksList: Task[] = [];
  phaseList: Phase[] = [];
  phaseId: any;
  parentId: any;
  phaseTitle: string = '';
  projectId: string = '';
  phaseStatus: string = '';
  minStartDate: Date;
  minEndDate: Date;
  maxStartDate: any
  noDataFound = noDataFound

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private activated: ActivatedRoute, private router: Router,) {
    this.parentId = this.activated.snapshot.paramMap.get('id');
    this.minStartDate = new Date();
    this.minEndDate = new Date();
  }

  ngOnInit(): void {

    this.taskForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(60),]],
        type: [null, Validators.required],
        status: newStatus,
        priority: null,
        startDate: null,
        endDate: null,
        estimatedTime: 0,
        phaseId: null,
        parentId: null,
        userId: null,
        comment: null,
      });

    this.getDetails()
  }

  getPhasesList(projectId: any) {
    // @ts-ignore
    this.dataService.getCollection(new Phase(), '/' + projectId)
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.phaseList = response
          }
        })
  }

  getTasksPhaseList(phaseId: any) {
    //@ts-ignore
    this.dataService.getCollection(new Task(), '/' + phaseId+ `?canceledStatus=${canceledStatus}`)
      .pipe()
      .subscribe((result) => {
        //@ts-ignore
        this.tasksList = result
      })
  }

  getDetails() {
    // @ts-ignore
    const task = new Task();
    task.setId(this.parentId);
    //@ts-ignore
    this.dataService.getItem(task, '/getOne')
      .pipe()
      .subscribe((res) => {
        this.phaseTitle = res.phase.title
        this.projectId = res.phase.projectId
        this.phaseStatus = res.phase.status
        this.usersList = res.phase.project.users;
        this.getPhasesList(this.projectId)
        this.getTasksPhaseList(res.phaseId);
        this.taskForm.controls['phaseId'].setValue(res.phaseId)
        this.taskForm.controls['parentId'].setValue(res.id)
      })
  }

  changePhase(id: any) {
    this.getTasksPhaseList(id);
    this.phaseList.forEach((phase => {
      if (phase.id === id) {
        this.phaseTitle = phase.title;
        this.phaseId = phase.id
        this.phaseStatus = phase.status
      }
    }));
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
    if (this.taskForm.valid) {
      let task = {
        name: this.taskForm.value.name,
        type: this.taskForm.value.type,
        status: this.taskForm.value.status,
        priority: this.taskForm.value.priority,
        startDate: this.taskForm.value.startDate,
        endDate: this.taskForm.value.endDate,
        estimatedTime: this.taskForm.value.estimatedTime,
        userId: this.taskForm.value.userId,
        phaseId: this.taskForm.value.phaseId,
        comment: this.taskForm.value.comment,
      };
      // @ts-ignore
      this.dataService.postItem(new Task(), `/addChild/` + this.taskForm.value.parentId + `?inProgressStatus=${inProgressStatus}&completedStatus=${completedStatus}`, task)
        .pipe()
        .subscribe({
          next: (res) => {
            this.close()

            Toast.fire({
              icon: 'success',
              title: 'Ticket Ajouté Avec Succès.',
              position: 'top-end',
            })
          },
          error: () => {
            Toast.fire({
              icon: 'error',
              text: BadInput.message,
              position: 'bottom',
              width: 450,
            })
          }
        })
    } else {
      // @ts-ignore
      Functions.validateOnSubmit(this.taskForm);
    }
  }

  close() {
    this.router.navigate(['/project/details', this.projectId])
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getStatusClass(): string {
    switch (this.phaseStatus) {
      case newStatus:
        return 'label label-success';
      case inProgressStatus:
        return 'label label-warning';
      case completedStatus:
        return 'label label-megna';
      default:
        return 'label label-info';
    }
  }

  checkDate() {
    if (this.taskForm.value.endDate != null)
      this.maxStartDate = this.taskForm.value.endDate

    if (this.taskForm.value.startDate != null)
      this.minEndDate = this.taskForm.value.startDate
  }
}


