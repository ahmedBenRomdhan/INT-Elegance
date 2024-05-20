import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Phase } from '../model/phase';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { backlog, newStatus, otherTasks } from '../../utils/variables';
import { matTooltipClose } from 'src/app/utils/variables';

@Component({
  selector: 'app-delete-phase',
  templateUrl: './delete-phase.component.html',
  styleUrls: ['./delete-phase.component.scss']
})
export class DeletePhaseComponent implements OnInit {

  action: any;
  local_data: any;
  newStatus = newStatus
  backlog = backlog
  otherTasks = otherTasks
  matTooltipClose = matTooltipClose
  
  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<DeletePhaseComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Phase
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
  }

  deletePhase() {
    // @ts-ignore
    const phaseModel = new Phase();
    phaseModel.setId(this.data.id);
    // @ts-ignore
    this.dataService.deleteItem(phaseModel, `/delete?backlog=${backlog}&otherTasks=${otherTasks}&newStatus=${newStatus}`, this.data.id).subscribe({
      next: (res: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          width: 380,
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
          title: 'Phase Supprimé Avec Succès.'
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