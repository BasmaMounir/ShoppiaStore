import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StockDetails } from '../models/StockDetails';
import { Observable } from 'rxjs';
import { StoreByWarehouse } from '../models/StoreByWarehouse';
import { StoreByProduct } from '../models/StoreByProduct';
import { Product } from '../models/ProductDto';
import { Store } from '../models/Store';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private server = 'http://localhost:8081/stores';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  public addStock(stockDetails: StockDetails): Observable<void> {
    return this.http.post<void>(`${this.server}/add`, stockDetails, {
      headers: this.getAuthHeaders()
    });
  }

    public consumeStock(stockDetails: StockDetails): Observable<void> {
    return this.http.post<void>(`${this.server}/consume`, stockDetails, {
      headers: this.getAuthHeaders()
    });
  }

    public getStoreEntriesByWarehouse(warehouseId?: number): Observable<StoreByWarehouse[]> {

      let params = new HttpParams();

      if(warehouseId != null){
        params = params.set('warehouse', warehouseId.toString());
      }

    return this.http.post<StoreByWarehouse[]>(`${this.server}/warehouses`, null, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

    public getStoreEntriesByProduct(productId?: number): Observable<StoreByProduct[]> {

      let params = new HttpParams();

      if(productId != null){
        params = params.set('product', productId.toString());
      }

    return this.http.post<StoreByProduct[]>(`${this.server}/products`, null, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

    public getAllProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.server}/products`, {
      headers: this.getAuthHeaders()
    });
  }

    public getNumberOfProducts(): Observable<number>{
      return this.http.get<number>(`${this.server}/products/count`, {
        headers: this.getAuthHeaders()
      });
    }

      public getTotalStockOfStores(): Observable<number>{
      return this.http.get<number>(`${this.server}/count`, {
        headers: this.getAuthHeaders()
      });
    }

    public getStoreEntries(): Observable<Store[]> {
      return this.http.get<Store[]>(this.server, {
        headers: this.getAuthHeaders()
      });
    }
}
