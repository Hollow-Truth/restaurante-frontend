import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../../services/finance.service';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cash-register',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputNumberModule, TableModule, TagModule, DialogModule, ToastModule],
  providers: [MessageService],
  templateUrl: './cash-register.component.html'
})
export class CashRegisterComponent implements OnInit {
  
  cajas: any[] = [];
  cajaAbierta: any = null;

  // Variables para Modales
  showOpenModal = false;
  showCloseModal = false;
  
  // Inputs
  montoInicial: number = 200;
  montoArqueo: number = 0;

  constructor(private financeService: FinanceService, private msg: MessageService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.financeService.getCajas().subscribe(data => {
      this.cajas = data;
      // Buscar si hay alguna abierta (is_closed = false)
      this.cajaAbierta = data.find(c => !c.is_closed);
    });
  }

  abrirCaja() {
    this.financeService.openBox(this.montoInicial).subscribe({
      next: (res) => {
        this.msg.add({severity:'success', summary:'Caja Abierta', detail:'El día operativo ha comenzado'});
        this.showOpenModal = false;
        this.cargarDatos();
      },
      error: (err) => {
        const errorMsg = err.error?.error || 'No se pudo abrir la caja';
        this.msg.add({severity:'error', summary:'Error', detail: errorMsg});
      }
    });
  }

  prepararCierre() {
    // Sugerimos el monto del sistema como referencia (o lo dejamos en 0 para ciegas)
    this.montoArqueo = 0; 
    this.showCloseModal = true;
  }

  cerrarCaja() {
    if (!this.cajaAbierta) return;

    this.financeService.closeBox(this.cajaAbierta.id, this.montoArqueo).subscribe({
      next: (res) => {
        // Calcular diferencia visualmente para el mensaje
        const diff = res.difference;
        let detalle = 'Cierre exitoso.';
        if (diff < 0) detalle = `Faltante de ${diff} Bs ⚠️`;
        if (diff > 0) detalle = `Sobrante de ${diff} Bs`;

        this.msg.add({severity: diff < 0 ? 'warn' : 'success', summary:'Caja Cerrada', detail: detalle});
        this.showCloseModal = false;
        this.cargarDatos();
      },
      error: (err) => this.msg.add({severity:'error', summary:'Error', detail:'No se pudo cerrar la caja'})
    });
  }
}