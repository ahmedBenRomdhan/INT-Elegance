import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from '../model/role';
import Swal from 'sweetalert2'
import { DataService } from '../../../services/data.service';
import { BadInput } from 'src/app/common/errors/bad-input';
import { cancelButton, editButton, matTooltipClose } from 'src/app/utils/variables';
import { editRoleCard, requiredRoleName, rolePermissionsLabel, successMessageEditRole } from '../../utils/variables';
import { Permission } from '../model/permission';
import { showDashboardPermission } from 'src/app/utils/permissions';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

  roleForm: FormGroup = Object.create(null);;
  permissions: any = [];
  selectedValue: string[] = []
  matTooltipClose = matTooltipClose
  cancelButton = cancelButton
  editButton = editButton
  editRoleCard = editRoleCard
  requiredRoleName = requiredRoleName
  successMessageEditRole = successMessageEditRole
  rolePermissionsLabel = rolePermissionsLabel

  showDashboardPermission = showDashboardPermission
  permissionsGroups: any

  constructor(
    public dialogRef: MatDialogRef<EditRoleComponent>,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private authServ: AuthenticationService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Role) {
  }

  ngOnInit(): void {
    this.roleForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.minLength(3)]],
        description: [null],
        permissions: null,
      });

    this.getPermissionsList();
   

  }

  getPermissionsList() {
    // @ts-ignore
    this.dataService.getCollection(new Permission(), `?dashboardPermission=${showDashboardPermission}`)
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.permissionsGroups = response;
            if (this.data) {
              this.roleForm.controls['name'].setValue(this.data.name);
              this.roleForm.controls['description'].setValue(this.data.description);
  
              const selectedPermissionIds = new Set(this.data.permissions.map((element: any) => element.id));
              const initialSelectedPermissionIds :any = [];
  
              this.permissionsGroups.forEach((group: any) => {
                group.permissions.forEach((permission: any) => {
                  if (selectedPermissionIds.has(permission.id)) {
                    initialSelectedPermissionIds.push(permission.id);
                  }
                });
              });
  
              // Set initial selected permission IDs
              this.roleForm.controls['permissions'].setValue(initialSelectedPermissionIds);
            }
          }
        });
  }

  Submit() {
    const Toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    if (this.roleForm.valid) {
      // @ts-ignore
      const roleModel = new Role();
      roleModel.setId(this.data.id);
      // @ts-ignore
      this.dataService.putItem(roleModel, `/edit?dashboardPermission=${showDashboardPermission}`, this.roleForm.value)
        .pipe()
        .subscribe({
          next: (res: any) => {
            this.closeDialog()

            Toast.fire({
              icon: 'success',
              title: successMessageEditRole,
              position: 'top-end',
              width: 400,
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
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
