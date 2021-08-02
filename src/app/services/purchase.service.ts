import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { AuctionSubject } from '../model/auction-subject';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private purchaseUrl = 'http://localhost:9000/api/history';

  constructor(private httpClient: HttpClient) {}

  getLastPrice(username: string, code: string) {
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }

    return this.httpClient.get(`${this.purchaseUrl}/${username}/${code}`, { headers });
  }

  getBought(username: string) {
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }

    return this.httpClient.get(`${this.purchaseUrl}/bought/${username}`, { headers });
  }

  getBidded(username: string) {
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }

    return this.httpClient.get(`${this.purchaseUrl}/bidded/${username}`, { headers });
  }

    getNewBought(code: string, username: string) {
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    }

    return this.httpClient.get(`${this.purchaseUrl}/bought/${code}/${username}`, { headers });
  }
}
