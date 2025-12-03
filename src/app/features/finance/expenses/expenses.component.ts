import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../../services/finance.service';

// PrimeNG
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, DropdownModule, InputNumberModule, InputTextModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './expenses.component.html',
  styles: [`
    :host ::ng-deep .p-dropdown { width: 100%; }
    :host ::ng-deep .p-inputnumber { width: 100%; }
  `]
})
export class ExpensesComponent implements OnInit {
  
  cajas: any[] = [];
  
  categorias = [
    { label: 'Pago de Servicios (Luz/Agua/Internet)', value: 'SERVICE' },
    { label: 'Pago de Sueldos', value: 'SALARY' },
    { label: 'Otros Gastos Operativos', value: 'OTHER' }
  ];

  selectedBox: any;
  selectedCategory: any;
  description: string = '';
  amount: number | null = null;

  constructor(private financeService: FinanceService, private msg: MessageService) {}

  ngOnInit() {
    this.cargarCajas();
  }

  cargarCajas() {
    // CORRECCIÓN DE TIPOS AQUÍ 👇 (data: any[], c: any)
    this.financeService.getOpenBoxes().subscribe((data: any[]) => {
      this.cajas = data.filter((c: any) => !c.is_closed);
      if (this.cajas.length > 0) this.selectedBox = this.cajas[0];
    });
  }

  registrarGasto() {
    if (!this.selectedBox || !this.selectedCategory || !this.amount || !this.description) {
        this.msg.add({severity:'warn', summary:'Faltan datos', detail:'Completa todo el formulario'});
        return;
    }

    const payload = {
        cash_register: this.selectedBox.id,
        category: this.selectedCategory.value,
        description: this.description,
        amount: this.amount
    };

    this.financeService.saveExpense(payload).subscribe({
        next: () => {
            this.msg.add({severity:'success', summary:'Gasto Registrado', detail:`-${this.amount} Bs en la caja.`});
            this.limpiar();
            this.cargarCajas();
        },
        // CORRECCIÓN DE TIPO AQUÍ 👇 (err: any)
        error: (err: any) => {
            this.msg.add({severity:'error', summary:'Error', detail:'No se pudo registrar el gasto'});
        }
    });
  }

  limpiar() {
    this.selectedCategory = null;
    this.description = '';
    this.amount = null;
  }
}