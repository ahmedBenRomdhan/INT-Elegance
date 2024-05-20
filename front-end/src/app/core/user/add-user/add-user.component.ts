import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DataService } from 'src/app/services/data.service';
import { User } from '../model/user';
import { Role } from '../../role/model/role';
import { addUserCard, addUserMessage, departmentLabel, departments, emailPlaceholder, firstNamePlaceholder, lastNamePlaceholder, phoneNumberPlaceholder, positionPlaceholder, roleLabel } from '../../utils/variables';
import { BadInput } from 'src/app/common/errors/bad-input';
import { addButton, cancelButton, matTooltipClose, role } from 'src/app/utils/variables';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  UserForm: FormGroup = Object.create(null);
  roles: Role[] = [];
  imagePreview: any = './assets/images/users/avatar.jpg';
  departments: string[] = departments

  addUserCard = addUserCard
  firstNamePlaceholder = firstNamePlaceholder
  lastNamePlaceholder = lastNamePlaceholder
  emailPlaceholder = emailPlaceholder
  phoneNumberPlaceholder = phoneNumberPlaceholder
  departmentLabel = departmentLabel
  positionPlaceholder = positionPlaceholder
  roleLabel = roleLabel

  addButton = addButton
  cancelButton = cancelButton
  matTooltipClose = matTooltipClose

  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.UserForm = this.formBuilder.group(
      {
        firstName: [null, [Validators.required, Validators.minLength(3)]],
        lastName: [null, [Validators.required, Validators.minLength(3)]],
        email: [null, [Validators.required, Validators.email]],
        phoneNumber: [null,[Validators.required,Validators.pattern("[2,3,4,5,7,9]{1}[0-9]{7}")]
          ],
        department: [null, Validators.required],
        position: [null, Validators.required],
        image: null,
        roleId: [null, Validators.required],

      });
    this.getRolesList()
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
            if (this.authService.getUser().role.name !== role) {
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
      timer: 3500,
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
      this.dataService.postItemFD(new User(), '/add', formData)
        .pipe()
        .subscribe({
          next: (res) => {
            this.closeDialog();
            Toast.fire({
              icon: 'success',
              title: addUserMessage,
              position: 'top-end',
              width: 400,
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
    } else {
      // @ts-ignore
      Functions.validateOnSubmit(this.UserForm);
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
}
