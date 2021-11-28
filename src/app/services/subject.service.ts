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
    return this.httpClient.post(`${this.subjectUrl}`, subjectData);
  }

  put(subjectData: FormData) {
    return this.httpClient.put(`${this.subjectUrl}`, subjectData);
  }

  delete(code: String) {
    return this.httpClient.delete(`${this.subjectUrl}/${code}`);
  }

  bid(subject: AuctionSubject, price: number, username: string) {
    return this.httpClient.patch(`${this.subjectUrl}/${subject.code}/${price}/${username}`, {});
  }

  getSubject(code: string) {
    return this.httpClient.get(`${this.subjectUrl}/${code}`);
  }

  getActive() {
    return this.httpClient.get(`${this.subjectUrl}/active`);
  }

  getNew() {
    return this.httpClient.get(`${this.subjectUrl}/new`);
  }

  getBidded() {
    return this.httpClient.get(`${this.subjectUrl}/bidded`);
  }

  getBought() {
    return this.httpClient.get(`${this.subjectUrl}/bought`);
  }

  getArchive() {
    return this.httpClient.get(`${this.subjectUrl}/archive`);
  }
}
