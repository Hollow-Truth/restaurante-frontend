import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KitchenService {
  private apiUrl = 'http://localhost:8000/api/inventory';

  constructor(private http: HttpClient) {}

  // 1. Obtener Insumos (Papa, Carne...) para gastar
  getIngredients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/`);
    // Nota: Luego filtraremos en el componente is_dish=false
  }

  // 2. Obtener Platos (Silpancho...) para cocinar
  getDishes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/`);
    // Nota: Luego filtraremos is_dish=true
  }

  // 3. Guardar la olla
  saveProduction(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/production/`, data);
  }
  
  // 4. Historial de lo cocinado
  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/production/`);
  }
}