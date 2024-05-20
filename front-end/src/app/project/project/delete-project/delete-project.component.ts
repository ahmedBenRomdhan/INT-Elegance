import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { Project } from '../model/project';
import { matTooltipClose } from 'src/app/utils/variables';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss']
})
export class DeleteProjectComponent implements OnInit {

  action: any;
  local_data: any;
  matTooltipClose = matTooltipClose
  
  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<DeleteProjectComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Project
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
  }

  deleteProject() {
    // @ts-ignore
    const projectModel = new Project();
    projectModel.setId(this.data.id);
    // @ts-ignore
    this.dataService.deleteItem(projectModel, '/delete', this.data.id).subscribe({
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
          title: 'Projet Supprimé Avec Succès.'
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
