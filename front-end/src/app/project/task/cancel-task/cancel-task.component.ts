import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { Task } from '../model/task';
import { canceledStatus } from '../../utils/variables';

@Component({
  selector: 'app-cancel-task',
  templateUrl: './cancel-task.component.html',
  styleUrls: ['./cancel-task.component.scss']
})
export class CancelTaskComponent implements OnInit {
  action: any;
  local_data: any;

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<CancelTaskComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
  }

  cancelTask() {
    // @ts-ignore
    const taskModel = new Task();
    taskModel.setId(this.data.id)
    let taskObj = {
      status: canceledStatus,
      phaseId: this.data.phaseId,
    };
    // @ts-ignore
    this.dataService.putItem(taskModel, `/edit?canceledStatus=${canceledStatus}`, taskObj)
    .pipe()
    .subscribe({
      next: (res: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          width:380,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'Ticket Annulé Avec Succès.'
        })
      }
    });
    this.doAction()
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
