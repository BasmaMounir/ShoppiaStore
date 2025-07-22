import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { History } from '../models/History';

@Injectable({
  providedIn: 'root',
})

export class HistoryService {

  private server = 'https://store-api-production-1ed8.up.railway.app/history';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  public getAllRecords() : Observable<History[]>{
    return this.http.get<History[]>(this.server, {
      headers: this.getAuthHeaders()
    });
  }

  public getRecordsBy(warehouseId?: number, productId?: number): Observable<History[]> {

    let params = new HttpParams();

    if (warehouseId != null) {
    params = params.set('warehouse', warehouseId.toString());
    }

    if (productId != null) {
    params = params.set('product', productId.toString());
   }

    return this.http.post<History[]>(this.server, null, { 
      params,
      headers: this.getAuthHeaders()
    });

  }

  public deleteRecordsBy(warehouseId?: number | null,
     productId?: number | null): Observable<void> {

    let params = new HttpParams();

    if (warehouseId != null) {
    params = params.set('warehouse', warehouseId.toString());
    }

    if (productId != null) {
    params = params.set('product', productId.toString());
   }

   return this.http.delete<void>(`${this.server}/remove`, { 
     params,
     headers: this.getAuthHeaders()
   });
  }
}