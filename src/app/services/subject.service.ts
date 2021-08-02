import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuctionSubject } from '../model/auction-subject';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private subjectUrl = 'http://localhost:9000/api/subjects';
  newSubjectEvent = new Subject<AuctionSubject>();

  constructor(private httpClient: HttpClient) {}

  addNew(subjectData: FormData) {
    // let tokenAuthorization = localStorage.getItem('token');
    // const headers = {
    //   Authorization : tokenAuthorization
    // }    

    return this.httpClient.post(`${this.subjectUrl}`, subjectData);
  }


  put(subjectData: FormData) {
    // let tokenAuthorization = localStorage.getItem('token');
    // const headers = {
    //   Authorization : tokenAuthorization
    // }    

    return this.httpClient.put(`${this.subjectUrl}`, subjectData);
  }

  delete(code: String) {
    // let tokenAuthorization = localStorage.getItem('token');
    // const headers = {
    //   Authorization : tokenAuthorization
    // }    

    return this.httpClient.delete(`${this.subjectUrl}/${code}`);
  }
  // test(): Observable<any> {
  //   let tokenAuthorization = localStorage.getItem('token');

  //   const headers = {
  //     Authorization : tokenAuthorization,
  //     'Content-Type': 'application/json'
  //   }    
  //   let credentials = {
  //     username:"user1", 
  //     password: "test"
  //   };

  //   let httpParams = new HttpParams()
  //   .set('username', credentials.username)
  //   .set('password', credentials.password)
  //   .set('grant_type', 'password');

  //   return this.httpClient.patch(`${this.baseUrl}subjects/testUser`, httpParams, { headers });
  // }

  bid(subject: AuctionSubject, price: number, username: string) {
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }    

    let credentials = {
      username:"user1", 
      password: "test"
    };

    let httpParams = new HttpParams()
    .set('username', credentials.username)
    .set('password', credentials.password)
    .set('grant_type', 'password');


    return this.httpClient.patch(`${this.subjectUrl}/${subject.code}/${price}/${username}`, httpParams, { headers });
  }

  getSubject(code: string) {
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }    

    return this.httpClient.get(`${this.subjectUrl}/${code}`, { headers });
  }

  // getAll(archive: boolean) {//do zaorania
  //   let tokenAuthorization = localStorage.getItem('token');
  //   const headers = {
  //     Authorization : tokenAuthorization
  //   }

  //   return this.httpClient.get(`${this.subjectUrl}?archive=${archive}`, { headers });
  // }
//------------------------------------------------------
  getActive() {//niearchiwalne z datą wystawienia
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }

    return this.httpClient.get(`${this.subjectUrl}/active`, { headers });
  }

  getNew() {//bez daty wystawienia
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }

    return this.httpClient.get(`${this.subjectUrl}/new`, { headers });
  }

  getBidded() {//niearchiwalne z soldPrice > basicPrice
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }

    return this.httpClient.get(`${this.subjectUrl}/bidded`, { headers });
  }

  getBought() {//archiwalne z soldPrice > basicPrice
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }

    return this.httpClient.get(`${this.subjectUrl}/bought`, { headers });
  }

  getArchive() {//archiwalne
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }

    return this.httpClient.get(`${this.subjectUrl}/bought`, { headers });
  }


}
