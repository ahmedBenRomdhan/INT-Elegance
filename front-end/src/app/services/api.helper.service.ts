import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error.handler.service';


@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
    ) { }
//
  sendApiRequest<T>(method: string, uri: string, headers: HttpHeaders, params: HttpParams, body: any): Observable<HttpResponse<T>> {
    if (method === 'get') {
      return this.http.get<T>( uri, { params, observe: 'response' })
        .pipe(
          catchError(this.errorHandlerService.handleError)
        );
    } else if (method === 'put') {
      return this.http.put<T>(uri, body, { headers, params, observe: 'response' })
        .pipe(
          catchError(this.errorHandlerService.handleError)
        );
    } else if (method === 'post') {
      return this.http.post<T>( uri, body, { headers, params, observe: 'response' })
        .pipe(
          catchError(this.errorHandlerService.handleError)
        );
    } else if (method === 'delete') {
      return this.http.delete<T>(uri, { headers, params, observe: 'response' })
        .pipe(
          catchError(this.errorHandlerService.handleError)
        );
    } else {
      return throwError('Unsupported request: ' + method);
    }
  }



}
