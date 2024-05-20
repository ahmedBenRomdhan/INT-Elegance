import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { CustomValidators } from 'ngx-custom-validators';
import { HttpClient } from '@angular/common/http';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  constructor(private fb: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,


  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit(): void {
    const formValue = this.form.value
    const email = formValue.email
    const password= formValue.password
    // const socket = this.socketService.getSocket()

    if(this.form.invalid){
      return;
    }

    this.authenticationService.login(formValue.email, formValue.password)

      // this.authenticationService.log(formValue.email, formValue.password).subscribe({
      //   next: (res: any) => {
      //     const accessToken = res.accessToken;
      //     // Check if the accessToken is valid before proceeding
      //     if (accessToken) {
      //       this.authenticationService.storeAccessToken(accessToken);
      //       this.authenticationService.storeRefrshToken(res.refreshToken);
      //       this.authenticationService.storeUser(res.user);

      //       this.router.navigate(['/dashboard']);
      // }}})
  }


}
