import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import { pageNotFound, notFoundText, backButton } from '../utils/variables';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})
export class Page404Component implements OnInit {

  pageNotFound = pageNotFound
  notFoundText = notFoundText
  backButton = backButton

  constructor(private authServ: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  redirect() {
    const user = this.authServ.getUser()
    if (user)
      this.router.navigate(['/dashboard'])
    else
      this.router.navigate(['/login'])

  }
}
