import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/core/user/model/user';
import { Task } from '../model/task';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Phase } from '../../phase/model/phase';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, MY_DATE_FORMATS } from '../../../utils/format-date';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from "src/environments/environment";
import { maxValidator } from '../../utils/validators';
import { TaskColumn } from '../../model/task-column';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';
import { MatDialog } from '@angular/material/dialog';
import { backlog, canceledStatus, completedStatus, inProgressStatus, integratedStatus, newStatus, otherTasks, priorities, resolvedStatus, trackers } from 'src/app/project/utils/variables';
import { BadInput } from 'src/app/common/errors/bad-input';
import { noDataFound } from 'src/app/utils/variables';
import { addChildTasksPermission, editTasksPermission, deleteTasksPermission, trailTasksPermission, changeTasksStatusPermission } from 'src/app/utils/permissions';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class EditTaskComponent implements OnInit {

  taskForm: FormGroup = Object.create(null);
  trackers: string[] = trackers;
  priorities: string[] = priorities;
  status: string[] = [];
  usersList: User[] = [];
  tasksList: Task[] = [];
  phaseList: Phase[] = [];
  taskId: any;
  phaseId: any;
  phaseTitle: string = '';
  projectId: string = '';
  taskUrl: string = '';
  currentTask!: Task
  phaseStatus: string = '';

  childrenTasksList: Task[] = [];
  Columns = [
    { name: 'ID', active: true },
    { name: 'Type', active: true },
    { name: 'Nom', active: true },
    { name: 'Status', active: true },
    { name: 'Priorité', active: false },
    { name: 'Date Début', active: false },
    { name: 'Date Fin', active: false },
    { name: 'Temps Estimé', active: false },
    { name: 'Temps Passé', active: false },
    { name: 'Réalisation', active: true },
    { name: 'Assigné à', active: true },
    { name: 'Actions', active: true },
  ];
  displayedColumns = ['ID', 'Type', 'Nom', 'Status', 'Priorité', 'Date Début', 'Date Fin', 'Temps Estimé', 'Temps Passé', 'Réalisation', 'Assigné à', 'Actions'];

  columnShowHideList: TaskColumn[] = [];
  panelOpenState: boolean = false;

  dataSource = new MatTableDataSource<Task>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  childrenTasks = false
  newStatus = newStatus
  completedStatus = completedStatus
  inProgressStatus = inProgressStatus
  canceledStatus = canceledStatus

  backlog = backlog

  minEndDate: Date | null = null;
  maxStartDate: Date | null = null;
  realisation = 0
  noDataFound = noDataFound


  addChildTasksPermission = addChildTasksPermission
  editTasksPermission = editTasksPermission
  deleteTasksPermission = deleteTasksPermission
  trailTasksPermission = trailTasksPermission
  changeTasksStatusPermission = changeTasksStatusPermission

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private dataService: DataService,
    private activated: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private authService: AuthenticationService,
  ) {
    this.taskId = this.activated.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {

    this.taskForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(60),]],
        type: [null, Validators.required],
        status: null,
        priority: null,
        startDate: null,
        endDate: null,
        estimatedTime: 0,
        phaseId: null,
        parentId: null,
        userId: null,
        comment: null,
        realisation: [0, [maxValidator(100)]],
        passedTime: 0,
        url: null,
      });
    this.getChildrenTasksList()
    this.getTask()
    this.initializeColumnProperties();
  }

  setSatus(task: any) {
    if (this.hasPermission(changeTasksStatusPermission)) {
      this.status = [newStatus, inProgressStatus, resolvedStatus, integratedStatus, completedStatus, canceledStatus]
    }
    else {
      switch (task.status) {
        case newStatus: {
          if (task.phase.title !== backlog)
            this.status = [newStatus, inProgressStatus];
          else
            this.status = [newStatus]
          break;
        }
        case inProgressStatus: {
          this.status = [inProgressStatus, resolvedStatus, canceledStatus];
          break;
        }
        case resolvedStatus: {
          this.status = [resolvedStatus, integratedStatus, canceledStatus];
          break;
        }
        case integratedStatus: {
          if (!this.childrenTasks)
            this.status = [integratedStatus, completedStatus, canceledStatus];
          else
            this.status = [integratedStatus, canceledStatus];
          break;
        }
        case completedStatus: {
          this.status = [completedStatus, canceledStatus];
          break;
        }
      }
    }
  }


  getTask() {
    // @ts-ignore
    const task = new Task();
    task.setId(this.taskId);
    //@ts-ignore
    this.dataService.getItem(task, '/getOne')
      .pipe()
      .subscribe((res) => {
        this.getDetails(res.phaseId)
        this.setSatus(res)
        this.taskForm.controls['name'].setValue(res.name)
        this.taskForm.controls['type'].setValue(res.type)
        this.taskForm.controls['status'].setValue(res.status)
        this.taskForm.controls['priority'].setValue(res.priority)
        this.taskForm.controls['startDate'].setValue(res.startDate)
        this.taskForm.controls['endDate'].setValue(res.endDate)
        this.taskForm.controls['estimatedTime'].setValue(res.estimatedTime)
        this.taskForm.controls['phaseId'].setValue(res.phaseId)
        this.taskForm.controls['parentId'].setValue(res.parentId)
        this.taskForm.controls['userId'].setValue(res.userId)
        this.taskForm.controls['comment'].setValue(res.comment)
        this.taskForm.controls['realisation'].setValue(res.realisation)
        this.realisation = res.realisation
        this.taskForm.controls['passedTime'].setValue(res.passedTime)
        this.taskForm.controls['url'].setValue(res.url)
        this.currentTask = res
        this.checkDate()
      })
  }

  checkDate() {
    if (this.taskForm.value.endDate != null)
      this.maxStartDate = this.taskForm.value.endDate

    if (this.taskForm.value.startDate != null)
      this.minEndDate = this.taskForm.value.startDate
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
            if (this.taskForm.controls['status'].value != newStatus)
              this.phaseList = this.phaseList.filter(phase => phase.title !== backlog);
          }
        })
  }

  getTasksPhaseList(phaseId: any) {
    //@ts-ignore
    this.dataService.getCollection(new Task(), '/' + phaseId + `?canceledStatus=${canceledStatus}`)
      .pipe()
      .subscribe((result) => {
        //@ts-ignore
        this.tasksList = result
        this.tasksList = this.tasksList.filter(task => task.id !== this.currentTask.id);
      })
  }

  getDetails(phaseId: any) {
    // @ts-ignore
    const phase = new Phase();
    phase.setId(phaseId);
    //@ts-ignore
    this.dataService.getItem(phase, '/getOne')
      .pipe()
      .subscribe((res) => {
        this.phaseTitle = res.title
        this.phaseStatus = res.status
        this.projectId = res.projectId
        this.usersList = res.project.users;
        this.getPhasesList(this.projectId)
        this.getTasksPhaseList(phaseId);
      })
  }

  changeStatus(value: any) {
    if (value == newStatus) {
      this.taskForm.controls['realisation'].setValue(0)
      this.taskForm.controls['passedTime'].setValue(0)

    }
    else if (value == completedStatus)
      this.taskForm.controls['realisation'].setValue(100)

    else
      this.taskForm.controls['realisation'].setValue(this.realisation)

    if (value != newStatus)
      this.phaseList = this.phaseList.filter(phase => phase.title !== backlog);

  }

  changePhase(id: any) {
    this.getTasksPhaseList(id);
    this.phaseList.forEach((phase => {
      if (phase.id === id) {
        this.phaseStatus = phase.status
        this.phaseTitle = phase.title;
        this.phaseId = phase.id

        if (this.phaseTitle != backlog)
          this.status = [newStatus, inProgressStatus];
        else
          this.getTask()
      }
    }));
  }

  submit() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
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
        parentId: this.taskForm.value.parentId,
        phaseId: this.taskForm.value.phaseId,
        comment: this.taskForm.value.comment,
        realisation: this.taskForm.value.realisation,
        passedTime: this.taskForm.value.passedTime,
        url: this.taskForm.value.url
      };
      // @ts-ignore
      const taskModel = new Task();
      taskModel.setId(this.taskId);
      // @ts-ignore
      this.dataService.putItem(taskModel, `/edit?newStatus=${this.newStatus}&inProgressStatus=${this.inProgressStatus}&completedStatus=${this.completedStatus}&canceledStatus=${this.canceledStatus}&backlog=${this.backlog}&otherTasks=${otherTasks}`, task)
        .pipe()
        .subscribe({
          next: (res) => {
            this.close()
            Toast.fire({
              icon: 'success',
              title: 'Ticket Modifié Avec Succès.'
            })
          },
          error: () => {
            Toast.fire({
              icon: 'warning',
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

  isValueExceedingMax(): boolean {
    const max = 100;
    const value = this.taskForm.controls['realisation'].value;
    return value > max;
  }

  copyUrl(value: string) {

    if (this.taskForm.value.url) {
      value = `${environment.gitLabBaseUrl}${environment.gitlabProjectId}/${environment.gitlabCommitPath}${this.taskForm.value.url}`;
      this.taskUrl = value
      const textField = document.createElement('textarea');
      textField.innerText = value;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      this.snackBar.open('URL copiée dans le presse-papiers', 'Fermer', {
        duration: 3000,
      });
    } else {
      this.taskUrl = '';
    }
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

  isParentTask(): boolean {
    const list = this.tasksList.filter(task => task.parentId === this.currentTask.id);
    if (list.length > 0)
      return true
    return false
  }

  initializeColumnProperties() {
    this.Columns.forEach((element, index) => {
      this.columnShowHideList.push(
        { possition: index, name: element.name, isActive: element.active }
      );
    });
    this.toggleColumn({ position: 4, name: 'Priorité', isActive: false });
    this.toggleColumn({ position: 5, name: 'Date Début', isActive: false })
    this.toggleColumn({ position: 6, name: 'Date Fin', isActive: false })
    this.toggleColumn({ position: 7, name: 'Temps Estimé', isActive: false })
    this.toggleColumn({ position: 8, name: 'Temps Passé', isActive: false })
  }

  toggleColumn(column: any) {
    if (column.isActive) {
      if (column.possition > this.displayedColumns.length - 1) {
        this.displayedColumns.push(column.name);
      } else {
        this.displayedColumns.splice(column.possition, 0, column.name);
      }
    } else {
      let i = this.displayedColumns.indexOf(column.name);
      let opr = i > -1 ? this.displayedColumns.splice(i, 1) : undefined;
    }
  }

  getChildrenTasksList() {
    let count = 0
    //@ts-ignore
    this.dataService.getCollection(new Task(), '/getChildren/' + this.taskId)
      .pipe()
      .subscribe((result) => {
        if (result) {
          this.childrenTasksList = result;
          this.dataSource = new MatTableDataSource(this.childrenTasksList);
          this.dataSource.paginator = this.paginator;
          this.childrenTasksList.forEach(child => {
            if (child.status === completedStatus)
              count++
          })
          if (this.childrenTasksList.length !== count)
            this.childrenTasks = true
        }
      });
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'Task':
        return 'bg-warning';
      case 'Bug':
        return 'bg-danger';
      case 'Feature':
        return 'bg-primary';
      case 'Remark':
        return 'bg-secondary';
      case 'Item':
        return 'bg-megna';
      case 'Action':
        return 'bg-success';
      default:
        return 'bg-primary';
    }
  }

  openDeleteDialog(obj: any) {
    const dialogRef = this.dialog.open(DeleteTaskComponent, {
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getChildrenTasksList()
    })
  }

  editTask(id: number) {
    this.router.navigate(['/project/task/edit', id]).then(() => { window.location.reload(); })
  }

  hasPermission(path: string): boolean {
    const user = this.authService.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)

    if (permissions.includes(path))
      return true
    else return false
  }
}


