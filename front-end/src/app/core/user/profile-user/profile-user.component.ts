import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { User } from '../model/user';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { CustomValidators } from 'ngx-custom-validators';
import { BadInput } from 'src/app/common/errors/bad-input';
import { editUsersPermission } from 'src/app/utils/permissions';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.scss']
})
export class ProfileUserComponent implements OnInit {

  Toast = Swal.mixin({
    toast: true,
    width: 440,
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  UserForm: FormGroup = Object.create(null);
  passwordForm: FormGroup = Object.create(null);
  imagePreview: any;
  id: any;
  roleId: any
  userPassword: any;
  password = new FormControl(null, Validators.compose([
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
    Validators.required
  ]));
  confirmPassword = new FormControl(null, CustomValidators.equalTo(this.password));

  editUsersPermission = editUsersPermission

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private authServ: AuthenticationService
  ) {
    this.id = this.authServ.getUser().id
  }

  ngOnInit(): void {
    this.getUser();

    this.UserForm = this.formBuilder.group(
      {
        firstName: [null, [Validators.required, Validators.minLength(3)]],
        lastName: [null, [Validators.required, Validators.minLength(3)]],
        email: [null, [Validators.required, Validators.email]],
        phoneNumber: [null, [Validators.required,
        Validators.pattern("[2,3,4,5,7,9]{1}[0-9]{7}")]],
        department: [null, Validators.required],
        position: [null, Validators.required],
        image: null,
        roleId: [null, Validators.required],

      });
    this.passwordForm = this.formBuilder.group({
      oldPassword: [null, Validators.required],
      confirmPassword: this.confirmPassword,
      password: this.password,
    })
  };


  getUser() {
    // @ts-ignore
    const user = new User();
    user.setId(this.id);
    // @ts-ignore
    this.dataService.getItem(user, '/profile')
      .pipe()
      .subscribe(
        (response) => {

          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.UserForm.controls['firstName'].setValue(response.firstName)
            this.UserForm.controls['lastName'].setValue(response.lastName)
            this.UserForm.controls['email'].setValue(response.email)
            this.UserForm.controls['phoneNumber'].setValue(response.phoneNumber)
            this.UserForm.controls['department'].setValue(response.department)
            this.UserForm.controls['position'].setValue(response.position)
            this.imagePreview = response.image;
            this.UserForm.controls['roleId'].setValue(response.role.name)
            this.userPassword = response.password
            this.roleId = response.roleId
          }
        });
  }

  updateUser() {

    if (this.UserForm.valid) {
      const formData = new FormData();
      formData.append('firstName', this.UserForm.value.firstName);
      formData.append('lastName', this.UserForm.value.lastName);
      formData.append('email', this.UserForm.value.email);
      formData.append('phoneNumber', this.UserForm.value.phoneNumber);
      formData.append('department', this.UserForm.value.department);
      formData.append('position', this.UserForm.value.position);
      formData.append('image', this.UserForm.value.image);
      formData.append('roleId', this.roleId);

      // @ts-ignore
      const userModel = new User();
      userModel.setId(this.id);
      // @ts-ignore
      this.dataService.putItemFD(userModel, '/edit', formData)
        .pipe()
        .subscribe({
          next: (res: any) => {
            var userFromLocalStorage = this.authServ.getUser()
            userFromLocalStorage.firstName = res.body.firstName;
            userFromLocalStorage.lastName = res.body.lastName;
            userFromLocalStorage.phoneNumber = res.body.phoneNumber;
            if (res.body.image)
              userFromLocalStorage.image = res.body.image;

            this.authServ.storeUser(userFromLocalStorage)

            location.reload()
            this.Toast.fire({
              icon: 'success',
              title: 'Profile Modifié avec Succès !',
              position: 'top-end',

            })
          }
        })
    }
  }

  updatePassword() {

    if (this.passwordForm.valid) {

      // @ts-ignore
      const userModel = new User();
      userModel.setId(this.id);
      const passwordObj = {
        password: this.passwordForm.value.password,
        oldPassword: this.passwordForm.value.oldPassword
      }
      // @ts-ignore
      this.dataService.putItem(userModel, '/editPassword', passwordObj)
        .pipe()
        .subscribe({
          next: (res: any) => {
            this.Toast.fire({
              icon: 'success',
              title: 'Mot de passe Modifié avec Succès !',
              position: 'top-end',
            })
            this.passwordForm.controls['password'].setValue("")
            this.passwordForm.controls['oldPassword'].setValue("")
            this.passwordForm.controls['confirmPassword'].setValue("")

          },
          error: () => {
            this.Toast.fire({
              icon: 'error',
              text: BadInput.message,
              position: 'bottom',
              width: 450,
            })
          }
        })
    }
  }

  cancel() {
    this.getUser();
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
