import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, SaleRequest } from '../models';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class PosService {
  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  getMenu(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/`);
  }

  cobrar(venta: SaleRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/sales/`, venta);
  }
}