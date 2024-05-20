import { AppError } from '../common/errors/app-error';
import { NotAllowedError } from '../common/errors/not-allowed-error';
import { NotFoundError } from '../common/errors/not-found-error';
import { BadInput } from '../common/errors/bad-input';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  handleError(response: HttpErrorResponse) {
        
    if (response.status === 400) {      
      return throwError(new BadInput(response.error));
    }
    if (response.status === 422) {
      return throwError(new BadInput(response.error));
    }
    if (response.status === 404) {
      return throwError(new NotFoundError(response.error));
    }

    if (response.status === 405) {
      return throwError(new NotAllowedError(response.error));
    }

    return throwError(new AppError(response.error));
  }

}
