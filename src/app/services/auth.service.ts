import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import  { Credentials } from '../model/credentials'
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { UserInfo } from '../model/user-info';
import { UserInfoService } from '../services/userInfo.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:9000/api/';
  private authorizationData = 'Basic ' + btoa('client:password');

  constructor(private httpClient: HttpClient){};

  register(credentials: Credentials) {
    const headers = {
      Authorization : this.authorizationData,
      'Content-Type': 'application/json'
    }

    return this.httpClient.post(`${this.baseUrl}users/registration`, credentials, { headers });
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

  // private setUserInfo(): Promise<void> {
  //   let tokenAuthorization = localStorage.getItem('token');
  //   const headers = {
  //     Authorization : tokenAuthorization
  //   }    

  //   return new Promise<void>(resolve => {
  //     this.httpClient.get(`${this.baseUrl}users/info`, { headers })
  //       .subscribe((response: UserInfo) => {
  //         this.userInfo = response;
  //         this.userInfoService.userInfoEvent.next(this.userInfo);
  //         resolve();
  //       }, 
  //       err => console.log("kruwa" + err));
  //   })
  // }

  getUserInfo() {
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }

    return this.httpClient.get(`${this.baseUrl}users/info`, { headers })
  }

  isAuthenticated(): boolean {
    let tokenAuthorization = localStorage.getItem('token');
    return tokenAuthorization != null;
  }

  test(): Observable<any> {
    // let tokenAuthorization = localStorage.getItem('token');

    // const headers = {
    //   Authorization : tokenAuthorization,
    //   'Content-Type': 'application/json'
    // }    
    // let credentials = {
    //   username:"user1", 
    //   password: "test"
    // };

    // let httpParams = new HttpParams()
    // .set('username', credentials.username)
    // .set('password', credentials.password)
    // .set('grant_type', 'password');

    return this.httpClient.patch(`${this.baseUrl}subjects/testUser`, {});
  }
}
