import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import  { Credentials } from '../model/credentials'
import { map } from "rxjs/operators";
import { Observable, Subject } from 'rxjs';
import { UserInfo } from '../model/user-info';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  // userInfoEvent = new Subject<UserInfo>();
}
