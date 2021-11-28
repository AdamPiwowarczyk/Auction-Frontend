import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private purchaseUrl = 'http://localhost:9000/api/purchases';

  constructor(private httpClient: HttpClient) {}

  getLastPrice(username: string, code: string) {
    return this.httpClient.get(`${this.purchaseUrl}/${username}/${code}`);
  }

  getBought(username: string) {
    return this.httpClient.get(`${this.purchaseUrl}/bought/${username}`);
  }

  getBidded(username: string) {
    return this.httpClient.get(`${this.purchaseUrl}/bidded/${username}`);
  }

  getNewBought(code: string, username: string) {
    return this.httpClient.get(`${this.purchaseUrl}/bought/${code}/${username}`);
  }
}
