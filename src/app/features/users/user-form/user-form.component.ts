import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../../services/finance.service'; // Usamos finance service por simplicidad

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule, PasswordModule, DropdownModule, ToastModule],
  providers: [MessageService],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  
  username = '';
  password = '';
  selectedRole: any;
  
  roles = [
    { label: 'Cajero (Ventas)', value: 'CASHIER' },
    { label: 'Cocinero (Producción)', value: 'COOK' }
  ];

  constructor(private financeService: FinanceService, private msg: MessageService) {}

  crearUsuario() {
    if (!this.username || !this.password || !this.selectedRole) {
        this.msg.add({severity:'warn', summary:'Datos faltantes', detail:'Completa todos los campos'});
        return;
    }

    const payload = {
        username: this.username,
        password: this.password,
        role: this.selectedRole.value
    };

    this.financeService.createUser(payload).subscribe({
        next: () => {
            this.msg.add({severity:'success', summary:'Usuario Creado', detail:`${this.username} ahora es ${this.selectedRole.label}`});
            this.username = '';
            this.password = '';
            this.selectedRole = null;
        },
        error: () => this.msg.add({severity:'error', summary:'Error', detail:'No se pudo crear el usuario. Quizás ya existe.'})
    });
  }
}