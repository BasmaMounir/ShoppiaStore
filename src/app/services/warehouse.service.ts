import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Warehouse } from '../models/Warehouse';

@Injectable({
  providedIn: 'root',
})

export class WarehouseService{

  private server = 'http://localhost:8081/warehouses';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  public getAllLocations(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.server, {
      headers: this.getAuthHeaders()
    });
  }

  public addLocation(location: string): Observable<void>{
    return this.http.post<void>(`${this.server}/add`, location, {
      headers: this.getAuthHeaders()
    });
  }

  public getNumberOfWarehouses(): Observable<number> {
    return this.http.get<number>(`${this.server}/count`, {
      headers: this.getAuthHeaders()
    });
  }

  public deleteWarehouse(warehouseId: number): Observable<void> {
    let params = new HttpParams();
    params = params.set('warehouse', warehouseId.toString());
    
    return this.http.delete<void>(this.server, { 
      params,
      headers: this.getAuthHeaders()
    });
  }
}