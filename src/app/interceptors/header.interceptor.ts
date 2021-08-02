import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserInfo } from '../model/user-info';
import { UserInfoService } from '../services/userInfo.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // return next.handle(request);

    let tokenAuthorization = localStorage.getItem('token');

    if (tokenAuthorization == null || request.url.includes('oauth') || request.url.includes('users/info')) {
      return next.handle(request);
    }

    const headers = {
      Authorization : tokenAuthorization
    }

    return next.handle(request.clone({ setHeaders: headers }));
  }
}