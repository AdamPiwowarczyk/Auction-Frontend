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
    return this.httpClient.post(`${this.categorytUrl}`, category);
  }

  delete(categoryName: String) {
    return this.httpClient.delete(`${this.categorytUrl}/${categoryName}`);
  }

  getAll() {
    return this.httpClient.get(`${this.categorytUrl}`);
  }
}
