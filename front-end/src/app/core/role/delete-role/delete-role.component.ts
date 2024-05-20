import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role } from '../model/role';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';
import { cancelButton, deleteButton, matTooltipClose } from 'src/app/utils/variables';
import { deleteRoleCard, deleteRoleMessage, successMessageDeleteRole } from '../../utils/variables';

@Component({
  selector: 'app-delete-role',
  templateUrl: './delete-role.component.html',
  styleUrls: ['./delete-role.component.scss']
})
export class DeleteRoleComponent implements OnInit {

  action: any;
  local_data: any;
  matTooltipClose = matTooltipClose
  deleteRoleCard = deleteRoleCard
  cancelButton = cancelButton
  deleteButton = deleteButton
  deleteRoleMessage = deleteRoleMessage
  successMessageDeleteRole = successMessageDeleteRole

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<DeleteRoleComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Role
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
  }

  deleteRole() {
    // @ts-ignore
    const roleModel = new Role();
    roleModel.setId(this.data.id);
    // @ts-ignore
    this.dataService.deleteItem(roleModel, '/delete', this.data.id).subscribe({
      next: (res: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          width: 370,
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
          title: successMessageDeleteRole
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
