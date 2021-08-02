import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { AuctionSubject } from '../model/auction-subject';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categorytUrl = 'http://localhost:9000/api/categories';

  constructor(private httpClient: HttpClient) {}

  addNew(category: Category) {
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    };

    return this.httpClient.post(`${this.categorytUrl}`, category, { headers });
  }

  delete(categoryName: String) {
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    };

    return this.httpClient.delete(`${this.categorytUrl}/${categoryName}`, { headers });
  }

  getAll() {
    let tokenAuthorization = localStorage.getItem('token');
    const headers = {
      Authorization : tokenAuthorization
    };

    // return this.httpClient.get(`${this.categorytUrl}`);
    return this.httpClient.get(`${this.categorytUrl}`, { headers });
  }
}
