import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteProjectComponent } from 'src/app/project/project/delete-project/delete-project.component';
import { DataService } from 'src/app/services/data.service';
import { cancelButton, deleteButton, matTooltipClose } from 'src/app/utils/variables';
import Swal from 'sweetalert2';
import { Meeting } from '../../model/meeting';
import { deleteMeetingCard } from '../../utils/variables';

@Component({
  selector: 'app-delete-meeting',
  templateUrl: './delete-meeting.component.html',
  styleUrls: ['./delete-meeting.component.scss']
})
export class DeleteMeetingComponent implements OnInit {

  action: any;
  local_data: any;
  matTooltipClose = matTooltipClose
  deleteMeetingCard = deleteMeetingCard
  cancelButton = cancelButton
  deleteButton = deleteButton
  
  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<DeleteProjectComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Meeting
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
  }

  deleteMeeting() {
    // @ts-ignore
    const meetingModel = new Meeting();
    meetingModel.setId(this.data.id);
    // @ts-ignore
    this.dataService.deleteItem(meetingModel, '/delete', this.data.id).subscribe({
      next: (res: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          width:480,
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
          title: 'Réunion Supprimé Avec Succès.'
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
