import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule, PasswordModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styles: [`
    :host { 
        display: block; 
        height: 100vh; 
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router, private msg: MessageService) {}

  onLogin() {
    this.isLoading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        // Obtenemos el rol después de loguearnos
        const role = this.auth.getUserRole();
        
        // --- REDIRECCIÓN INTELIGENTE ---
        if (role === 'ADMIN') {
            this.router.navigate(['/dashboard']);
        } else if (role === 'CASHIER') {
            this.router.navigate(['/pos']);
        } else if (role === 'COOK') {
            this.router.navigate(['/kitchen']);
        } else {
            // Rol desconocido o usuario básico
            this.router.navigate(['/pos']); 
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.msg.add({severity:'error', summary:'Error', detail:'Usuario o contraseña incorrectos'});
      }
    });
  }
}