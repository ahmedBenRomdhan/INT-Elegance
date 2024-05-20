import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Task } from '../model/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html',
  styleUrls: ['./delete-task.component.scss']
})
export class DeleteTaskComponent implements OnInit {
  action: any;
  local_data: any;

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<DeleteTaskComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
  }

  deleteTask() {
    // @ts-ignore
    const taskModel = new Task();
    taskModel.setId(this.data.id);
    // @ts-ignore
    this.dataService.deleteItem(taskModel, '/delete', this.data.id).subscribe({
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
          title: 'Ticket Supprimé Avec Succès.'
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
