import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/token/`;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        
        // GUARDAMOS EL ROL Y EL USUARIO
        localStorage.setItem('user_role', response.role); 
        localStorage.setItem('username', response.username);
      })
    );
  }

  logout() {
    localStorage.clear(); // Borra todo (token y rol)
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserRole(): string {
    return localStorage.getItem('user_role') || '';
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'Usuario';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }
}