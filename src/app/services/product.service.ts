import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private allProductsUrl = 'https://catalog-service-production.up.railway.app/products';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get<any>(this.allProductsUrl);
  }

  getProductsByCategoryId(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.allProductsUrl}/category/${categoryId}`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.allProductsUrl}/id/${id}`);
  }
}