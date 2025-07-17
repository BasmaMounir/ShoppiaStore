import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private allProductsUrl = 'http://localhost:8085/products';
  private productsByCategoryUrl = 'http://localhost:8085/products/category';
  private productByIdUrl = 'http://localhost:8085/products/id';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get<any>(this.allProductsUrl);
  }

  getProductsByCategoryId(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.productsByCategoryUrl}/${categoryId}`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.productByIdUrl}/${id}`);
  }
}