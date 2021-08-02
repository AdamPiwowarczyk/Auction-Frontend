import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { ErrorDialogService } from '../services/error-dialog.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public errorDialogService: ErrorDialogService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        let message = errorResponse.error.message;
        this.errorDialogService.openDialog(message);
        return throwError(errorResponse);
      }));
  }
}
