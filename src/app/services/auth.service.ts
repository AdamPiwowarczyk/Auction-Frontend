import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import  { Credentials } from '../model/credentials'
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:9000/api/';
  private authorizationData = 'Basic ' + btoa('client:password');

  constructor(private httpClient: HttpClient){};

  register(credentials: Credentials) {
    return this.httpClient.post(`${this.baseUrl}users/registration`, credentials);
  }

  login(credentials: Credentials) {
    const headers = {
      Authorization : this.authorizationData,
      'Content-type': 'application/x-www-form-urlencoded'
    }

    let httpParams = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password)
      .set('grant_type', 'password');

    return this.httpClient.post(`${this.baseUrl}oauth/token`, httpParams, {headers}).pipe(
        map(response => {
          let responseValue: any;
          responseValue = response;
          let tokenType = responseValue.token_type;
          let tokenValue = responseValue.access_token;
          let token = `${tokenType} ${tokenValue}`
          localStorage.setItem('token', token);
          return responseValue;
        }))
  }

  getUserInfo() {
    return this.httpClient.get(`${this.baseUrl}users/info`)
  }

  isAuthenticated(): boolean {
    let tokenAuthorization = localStorage.getItem('token');
    return tokenAuthorization != null;
  }
}
