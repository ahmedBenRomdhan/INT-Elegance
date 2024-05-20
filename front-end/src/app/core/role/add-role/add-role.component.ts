import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { DataService } from '../../../services/data.service';
import { Role } from '../model/role';
import { BadInput } from 'src/app/common/errors/bad-input';
import { addButton, cancelButton, matTooltipClose } from 'src/app/utils/variables';
import { addRoleCard, requiredRoleName, roleDescriptionPlaceholder, roleNamePlaceholder, rolePermissionsLabel, successMessageAddRole } from '../../utils/variables';
import { showDashboardPermission } from 'src/app/utils/permissions';
import { Permission } from '../model/permission';
import { MatOption } from '@angular/material/core';

interface permissionGroup {
  groupName: string;
  permissions: Permission[];
}

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  roleForm: FormGroup = Object.create(null);;
  permissions: any = [];
  matTooltipClose = matTooltipClose
  addButton = addButton
  cancelButton = cancelButton
  addRoleCard = addRoleCard
  roleNamePlaceholder = roleNamePlaceholder
  roleDescriptionPlaceholder = roleDescriptionPlaceholder
  rolePermissionsLabel = rolePermissionsLabel
  requiredRoleName = requiredRoleName
  successMessageAddRole = successMessageAddRole

  showDashboardPermission = showDashboardPermission
  permissionsGroups :any
  @ViewChild('allSelected') private allSelected!: MatOption;

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<AddRoleComponent>,
    private formBuilder: FormBuilder) {}

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
      let role = {
        name: this.roleForm.value.name,
        description: this.roleForm.value.description,
        permissions: this.roleForm.value.permissions,
      };
      // @ts-ignore
      this.dataService.postItem(new Role(), `/add?dashboardPermission=${showDashboardPermission}`, role)
        .pipe()
        .subscribe({
          next: () => {
            this.closeDialog();

            Toast.fire({
              icon: 'success',
              title: successMessageAddRole,
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
    } else {
      // @ts-ignore
      Functions.validateOnSubmit(this.UserForm);
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      const allPermissionIds: number[] = this.permissionsGroups.reduce((acc:any, group:any) => {
        acc.push(...group.permissions.map((permission:any) => permission.id));
        return acc;
      }, []);
      this.roleForm.controls.permissions.patchValue([...allPermissionIds, 0]);
    } else {
      this.roleForm.controls.permissions.patchValue([]);
    }
  }
  
  
  
}
