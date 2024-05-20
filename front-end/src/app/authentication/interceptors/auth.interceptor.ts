import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  refresh = false;

  constructor(private http:HttpClient, private authenticationService : AuthenticationService  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.authenticationService.getAccessToken()
    if(accessToken){

      const req = request.clone({
        setHeaders:{
          authorization : `Bearer ${accessToken}`
        }
      })

    return next.handle(req).pipe(
     /* catchError((err: HttpErrorResponse) => {
      if (err.status === 403 && !this.refresh) {
        this.refresh = true;
        const refreshToken = this.authenticationService.getRefreshToken()
        return this.http.post(`${environment.apiUrl}/auth/refresh`, {token:refreshToken}).pipe(
          switchMap((res: any) => {
            const newAccessToken = res.accessToken
            this.authenticationService.storeAccessToken(newAccessToken)
            return next.handle(request.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`
              }
            }));
          })
        ) as Observable<HttpEvent<any>>;
      }
      this.refresh = false;
      return throwError(() => err);
    })*/
    );

  }

  return next.handle(request)

}
}
