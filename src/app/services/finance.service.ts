import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  // Ajusta el puerto si es necesario
  private apiUrl = 'http://localhost:8000/api/finance';

  constructor(private http: HttpClient) {}

  // Reportes
  getReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/report/`);
  }

  // --- CAJAS ---
  getCajas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cajas/`);
  }

  // ESTE FALTABA: Obtener cajas para el dropdown
  getOpenBoxes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cajas/`);
  }

  openBox(startAmount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cajas/`, { 
        start_amount: startAmount,
        date: new Date().toISOString().split('T')[0]
    });
  }

  closeBox(id: number, realAmount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cajas/${id}/close/`, { end_amount_real: realAmount });
  }

  // --- TRANSACCIONES ---
  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transactions/`);
  }

  // ESTE FALTABA: Registrar el Gasto
  saveExpense(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/expenses/`, data);
  }
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl.replace('/finance', '')}/users/`, user);
  }
}