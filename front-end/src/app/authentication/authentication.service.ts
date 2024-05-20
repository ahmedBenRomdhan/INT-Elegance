import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './user.model';
import { DataService } from '../services/data.service';
import { ErrorHandlerService } from '../services/error.handler.service';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BadInput } from '../common/errors/bad-input';
import { NotAllowedError } from '../common/errors/not-allowed-error';
import { NotFoundError } from '../common/errors/not-found-error';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private tokenTimer: any;
  errorMessage: string = ''

  constructor(private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private errorHandlerService: ErrorHandlerService,
  ) { }


  login(email: string, password: string) {

    const authData = { email: email, password: password };
    // @ts-ignore
    this.dataService.postItem(new User(), "auth/signin", authData)
      .subscribe({
        next: (res: any) => {
          this.storeAccessToken(res.accessToken);
          this.storeRefrshToken(res.refreshToken);
          this.storeUser(res.user);
          const expiresInDuration = res.expiresIn;
          if (res.refreshToken) {
            this.tokenTimer = setTimeout(() => {
              this.logout();
            }, expiresInDuration * 1000);
          }
          this.router.navigate(['/dashboard'])
        }
        ,
        error: () => {
          const Toast = Swal.mixin({
            toast: true,
            icon: 'error',
            position: 'bottom',
            width: 643,
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          if (NotAllowedError.message)
            Toast.fire({
              text: NotAllowedError.message,
            })
          if (BadInput.message)
            Toast.fire({
              text: BadInput.message,
            })
          if (NotFoundError.message)
            Toast.fire({
              text: NotFoundError.message
            })

          NotAllowedError.message = ""
          BadInput.message = ""
          NotFoundError.message = ""
        }
      })
  }

  forgot(email: string) {
    // @ts-ignore
    return this.dataService.postItem(new User(), "/auth/forgot", email)
      .pipe(catchError(err => this.errorHandlerService.handleError(err)))
      .subscribe(() => {
        this.router.navigate(['/login'])
      }
      );
  }

  logout() {
    this.deleteAccessToken()
    this.deleteRefreshToken()
    this.deleteUser()
    this.router.navigate(['/login'])
    clearTimeout(this.tokenTimer);
  }

  reset(password: string, id: string, token: string) {
    // @ts-ignore
    return this.dataService.postItem(new User(), `/auth/reset/${id}/${token}`, password).subscribe(() => {
      this.router.navigate(['/login'])
    })
  }


  storeAccessToken = (token: string) => {
    localStorage.setItem('accessToken', token)
  }

  storeRefrshToken = (token: string) => {
    localStorage.setItem('refreshToken', token)
  }

  getAccessToken = () => {
    return localStorage.getItem('accessToken')
  }

  getRefreshToken = () => {
    return localStorage.getItem('refreshToken')
  }

  deleteAccessToken = () => {
    localStorage.removeItem('accessToken')
  }

  deleteRefreshToken = () => {
    localStorage.removeItem('refreshToken')
  }

  storeUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  } 

  deleteUser = () => {
    localStorage.removeItem('user')
  }

  getUser = () => {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getToken(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }
}
