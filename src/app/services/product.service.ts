import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.backendUrl}/api/products`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product, { headers: this.headers });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Product>(url, product, { headers: this.headers });
  }

  deleteProduct(crawler: Product): Observable<{}> {
    const url = `${this.baseUrl}/${crawler.id}`;
    return this.http.delete<any>(url, { headers: this.headers });
  }
}
