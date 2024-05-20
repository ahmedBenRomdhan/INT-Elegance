import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { AuthenticationService } from '../authentication.service';
import { HttpClient, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private route: ActivatedRoute
    ){ }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: [
        null,
        Validators.compose([Validators.required])
      ]
    });
  }

  onSubmit(): void {

    const id = this.route.snapshot.params.id
    const token = this.route.snapshot.params.token
    this.authenticationService.reset(this.form.getRawValue(), id, token)
  }
}
