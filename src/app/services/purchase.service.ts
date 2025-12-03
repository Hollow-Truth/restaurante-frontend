import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  // Ajusta si tu puerto es diferente, pero 8000 es el estándar de Django
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // 1. Cajas Abiertas (Para el Dropdown "Dinero Origen")
  getOpenBoxes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/finance/cajas/`);
  }

  // 2. Insumos (Para el Dropdown "Producto")
  getSupplies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inventory/products/`);
  }

  // 3. Unidades (Para el Dropdown "Arroba/Kilo")
  getUnits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inventory/units/`);
  }

  // 4. Guardar la Compra
  savePurchase(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inventory/purchases/`, data);
  }
}