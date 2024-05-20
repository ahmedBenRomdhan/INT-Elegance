import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DataService } from 'src/app/services/data.service';
import { User } from '../model/user';
import { Role } from '../../role/model/role';
import { departmentLabel, departments, editUserCard, editUserMessage, emailPlaceholder, errorListRolePermission, firstNamePlaceholder, lastNamePlaceholder, phoneNumberPlaceholder, positionPlaceholder, roleLabel } from '../../utils/variables';
import { BadInput } from 'src/app/common/errors/bad-input';
import { cancelButton, editButton, matTooltipClose, role } from 'src/app/utils/variables';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { listRolesPermission } from 'src/app/utils/permissions';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  departments: string[] = departments
  UserForm: FormGroup = Object.create(null);;
  local_data: any;
  roles: Role[] = [];
  imagePreview: any = './assets/images/users/avatar.jpg';

  editUserCard = editUserCard
  firstNamePlaceholder = firstNamePlaceholder
  lastNamePlaceholder = lastNamePlaceholder
  emailPlaceholder = emailPlaceholder
  phoneNumberPlaceholder = phoneNumberPlaceholder
  departmentLabel = departmentLabel
  positionPlaceholder = positionPlaceholder
  roleLabel = roleLabel

  editButton = editButton
  cancelButton = cancelButton
  matTooltipClose = matTooltipClose

  listRolesPermission = listRolesPermission
  errorListRolePermission = errorListRolePermission

  role = role

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private authServ: AuthenticationService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: User) {

    this.local_data = { ...data };

    if (this.local_data.image === undefined) {
      this.local_data.image = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    }
  }

  ngOnInit(): void {
    this.UserForm = this.formBuilder.group(
      {
        firstName: [null, [Validators.required, Validators.minLength(3)]],
        lastName: [null, [Validators.required, Validators.minLength(3)]],
        email: [null, [Validators.required, Validators.email]],
        phoneNumber: [null,[Validators.required, Validators.pattern("[2,3,4,5,7,9]{1}[0-9]{7}")]
         ],
        department: [null, Validators.required],
        position: [null, Validators.required],
        image: null,
        roleId: [null, Validators.required],

      });
    this.getRolesList()

    if (this.data) {
      this.UserForm.controls['firstName'].setValue(this.data.firstName)
      this.UserForm.controls['lastName'].setValue(this.data.lastName)
      this.UserForm.controls['email'].setValue(this.data.email)
      this.UserForm.controls['phoneNumber'].setValue(this.data.phoneNumber)
      this.UserForm.controls['department'].setValue(this.data.department)
      this.UserForm.controls['position'].setValue(this.data.position)
      this.imagePreview = this.data.image
      if (this.hasPermission(listRolesPermission)) {
        this.UserForm.controls['roleId'].setValue(this.data.roleId)
      }
    }
  }

  getRolesList() {
    // @ts-ignore
    this.dataService.getCollection(new Role(), null)
      .pipe()
      .subscribe(
        (response: { roles: any; }) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.roles = response;
            if (this.authServ.getUser().role.name !== role) {
              // @ts-ignore
              this.roles = this.roles.filter((roleObj: any) =>
                roleObj.name !== role
              );
            }
          }
        });
  }

  submit() {
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
    if (this.UserForm.valid) {
      const formData = new FormData();
      formData.append('firstName', this.UserForm.value.firstName);
      formData.append('lastName', this.UserForm.value.lastName);
      formData.append('email', this.UserForm.value.email);
      formData.append('phoneNumber', this.UserForm.value.phoneNumber);
      formData.append('department', this.UserForm.value.department);
      formData.append('position', this.UserForm.value.position);
      formData.append('image', this.UserForm.value.image);
      formData.append('roleId', this.UserForm.value.roleId);

      // @ts-ignore
      const userModel = new User();
      userModel.setId(this.data.id);

      // @ts-ignore
      this.dataService.putItemFD(userModel, '/edit', formData)
        .pipe()
        .subscribe({
          next: (res: any) => {
            this.closeDialog()
            Toast.fire({
              icon: 'success',
              title: editUserMessage,
              position: 'top-end',
              width: 400
            })
          },
          error: () => {
            Toast.fire({
              icon: 'error',
              text: BadInput.message,
              position: 'bottom',
              width: 600,
            })
          }
        })
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onFileChange(event: Event) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];

    // @ts-ignore
    this.UserForm.patchValue({
      image: file
    });
    // @ts-ignore
    this.UserForm.get('image').updateValueAndValidity()
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    };
    reader.readAsDataURL(file);
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  hasPermission(path: string): boolean {
    const user = this.authServ.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)
    if (permissions.includes(path))
      return true
    else return false
  }
}
