import { Component, OnInit } from '@angular/core';
import { Task } from '../../task/model/task';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AddTaskComponent } from '../../task/add-task/add-task.component';
import { DeleteTaskComponent } from '../../task/delete-task/delete-task.component';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Phase } from '../model/phase';
import { completedStatus, inProgressStatus, integratedStatus, newStatus, resolvedStatus } from 'src/app/project/utils/variables';
import { BadInput } from 'src/app/common/errors/bad-input';
import Swal from 'sweetalert2';
import { NotFoundError } from 'src/app/common/errors/not-found-error';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { changeTasksStatusPermission, deleteTasksPermission } from 'src/app/utils/permissions';
import { CancelTaskComponent } from '../../task/cancel-task/cancel-task.component';

@Component({
  selector: 'app-board-phase',
  templateUrl: './board-phase.component.html',
  styleUrls: ['./board-phase.component.scss']
})
export class BoardPhaseComponent implements OnInit {
  newStatus = newStatus;
  inProgressStatus = inProgressStatus;
  integratedStatus = integratedStatus;
  resolvedStatus = resolvedStatus;
  completedStatus = completedStatus;

  newList: Task[] = [];
  inprogresList: Task[] = [];
  resolvedList: Task[] = [];
  integratedList: Task[] = [];
  doneList: Task[] = [];

  phaseId: any
  projectName: string | null = '';
  projectStatus: string = '';
  projectId: string = ''
  phaseTitle: string | null = '';

  deleteTasksPermission = deleteTasksPermission
  changeTasksStatusPermission = changeTasksStatusPermission

  constructor(public dialog: MatDialog, private activated: ActivatedRoute, private dataService: DataService, private authServ: AuthenticationService) {
    this.phaseId = this.activated.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getTasks()
    this.getDetails()
  }

  getTasks() {
    this.newList = [];
    this.inprogresList = [];
    this.resolvedList = [];
    this.integratedList = [];
    this.doneList = [];
    //@ts-ignore
    this.dataService.getCollection(new Task(), '/' + this.phaseId)
      .pipe()
      .subscribe((result) => {
        if (result) {
          //@ts-ignore
          result.forEach((task => {
            switch (task.status) {
              case newStatus: {
                //@ts-ignore
                this.dataService.getCollection(new Task(), '/getChildren/' + task.id)
                  .pipe()
                  .subscribe((childs) => {
                    if (childs.length > 0) {
                      task.children = childs.length
                    }
                  });
                this.newList.push(task);
                break;
              }
              case inProgressStatus: {
                //@ts-ignore
                this.dataService.getCollection(new Task(), '/getChildren/' + task.id)
                  .pipe()
                  .subscribe((childs) => {
                    if (childs.length > 0) {
                      task.children = childs.length
                    }
                  }); this.inprogresList.push(task);
                break;
              }
              case resolvedStatus: {
                //@ts-ignore
                this.dataService.getCollection(new Task(), '/getChildren/' + task.id)
                  .pipe()
                  .subscribe((childs) => {
                    if (childs.length > 0) {
                      task.children = childs.length
                    }
                  }); this.resolvedList.push(task);
                break;
              }
              case integratedStatus: {
                let count = 0
                //@ts-ignore
                this.dataService.getCollection(new Task(), '/getChildren/' + task.id)
                  .pipe()
                  .subscribe((childs) => {
                    if (childs.length > 0) {
                      task.children = childs.length
                      childs.forEach((child: any) => {
                        if (child.status === completedStatus)
                          count++
                      })
                      if (childs.length !== count)
                        task.isDisabled = true
                      else
                        task.isDisabled = false
                    }
                  });
                this.integratedList.push(task);

                break;
              }
              case completedStatus: {
                //@ts-ignore
                this.dataService.getCollection(new Task(), '/getChildren/' + task.id)
                  .pipe()
                  .subscribe((childs) => {
                    if (childs.length > 0) {
                      task.children = childs.length
                    }
                  });

                this.doneList.push(task);
                break;
              }
            }
          }));
        }

      });
  }

  getDetails() {
    // @ts-ignore
    const phase = new Phase();
    phase.setId(this.phaseId);
    //@ts-ignore
    this.dataService.getItem(phase, '/getOne')
      .pipe()
      .subscribe((res) => {
        this.phaseTitle = res.title
        this.projectName = res.project.name
        this.projectStatus = res.status
        this.projectId = res.project.id
      })
  }

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (this.hasPermission(changeTasksStatusPermission)) {
        this.transferItem(event)
      }
      else {
        switch (event.previousContainer.id) {
          case 'cdk-drop-list-0': {
            if (event.container.id === 'cdk-drop-list-1')
              this.transferItem(event)
            break;
          }
          case 'cdk-drop-list-1': {
            if (event.container.id === 'cdk-drop-list-2')
              this.transferItem(event)
            break;
          }
          case 'cdk-drop-list-2': {
            if (event.container.id === 'cdk-drop-list-3')
              this.transferItem(event)
            break;
          }
          case 'cdk-drop-list-3': {
            if (event.container.id === 'cdk-drop-list-4')
              this.transferItem(event)
            break;
          }
        }
      }
    }
  }

  transferItem(event: CdkDragDrop<any[]>): void {
    const droppedElement = event.previousContainer.data[event.previousIndex];
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    // @ts-ignore
    const task = new Task();
    task.setId(droppedElement.id);

    let taskObj = {
      name: droppedElement.name,
      type: droppedElement.type,
      status: this.setNewStatus(event.container.id),
      priority: droppedElement.priority,
      startDate: droppedElement.startDate,
      endDate: droppedElement.endDate,
      estimatedTime: droppedElement.estimatedTime,
      userId: droppedElement.userId,
      parentId: droppedElement.parentId,
      phaseId: droppedElement.phaseId,
      comment: droppedElement.comment,
      realisation: droppedElement.realisation,
      passedTime: droppedElement.passedTime,
      url: droppedElement.url
    };

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
    // @ts-ignore
    this.dataService.putItem(task, '/edit', taskObj)
      .pipe()
      .subscribe({
        next: (res) => {
          Toast.fire({
            icon: 'success',
            title: 'Ticket Modifié Avec Succès.'
          })
        },
        error: () => {
          if (BadInput.message) {
            this.getTasks()
            Toast.fire({
              icon: 'warning',
              position: 'bottom',
              width: 450,
              text: BadInput.message,
            })
          }
          if (NotFoundError.message)
            /* Toast.fire({
               icon: 'warning',
               position: 'bottom',
               width: 450,
               text: NotFoundError.message
             })*/

            BadInput.message = ""
          NotFoundError.message = ""
        }
      })
  }

  setNewStatus(containerId: string) {
    switch (containerId) {
      case 'cdk-drop-list-0': {
        return newStatus;
        break;
      }
      case 'cdk-drop-list-1': {
        return inProgressStatus;
        break;
      }
      case 'cdk-drop-list-2': {
        return resolvedStatus;
        break;
      }
      case 'cdk-drop-list-3': {
        return integratedStatus;
        break;
      }
      case 'cdk-drop-list-4': {
        return completedStatus;
        break;
      }
    }
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AddTaskComponent, {
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  deleteTask(task: any) {
    const dialogRef = this.dialog.open(DeleteTaskComponent, {
      data: task
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTasks();
    })
  }


  cancelTask(task: any) {
    const dialogRef = this.dialog.open(CancelTaskComponent, {
      data: task
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTasks();
    })
  }

  getStatusClass(status: string): string {
    switch (status) {
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

  hasPermission(path: string): boolean {
    const user = this.authServ.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)

    if (permissions.includes(path))
      return true
    else return false
  }

}




