import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseService } from '../../services/purchase.service';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, DropdownModule, InputNumberModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './purchases.component.html',
  styles: [`
    :host ::ng-deep .p-dropdown { width: 100%; }
    :host ::ng-deep .p-inputnumber { width: 100%; }
  `]
})
export class PurchasesComponent implements OnInit {
  
  cajasOptions: any[] = [];
  insumos: any[] = [];
  unidades: any[] = [];

  // Formulario
  selectedBox: any;
  selectedProduct: any;
  selectedUnit: any;
  quantity: number = 1;
  totalCost: number = 0;

  constructor(private purchaseService: PurchaseService, private msg: MessageService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Cargar Cajas Abiertas
    this.purchaseService.getOpenBoxes().subscribe({
      next: (data) => {
        this.cajasOptions = data;
        if (data.length > 0) this.selectedBox = data[0];
      },
      error: () => this.msg.add({severity:'error', summary:'Error', detail:'No se pudieron cargar las cajas'})
    });

    // 2. Cargar Insumos (Solo ingredientes, no platos)
    this.purchaseService.getSupplies().subscribe(data => {
      this.insumos = data.filter(p => p.is_dish === false);
    });

    // 3. Cargar Unidades
    this.purchaseService.getUnits().subscribe(data => {
      this.unidades = data;
    });
  }

  guardarCompra() {
    if (!this.selectedBox || !this.selectedProduct || !this.selectedUnit || this.totalCost <= 0) {
      this.msg.add({severity:'warn', summary:'Faltan datos', detail:'Completa el formulario correctamente'});
      return;
    }

    // Payload ajustado al nuevo Serializer de Django
    const payload = {
      cash_register: this.selectedBox.id,
      description: `Compra: ${this.selectedProduct.name}`,
      items: [
        {
          product_id: this.selectedProduct.id,      // <-- Coincide con backend
          unit_id: this.selectedUnit.id,            // <-- Coincide con backend
          quantity_bought: this.quantity,
          total_cost: this.totalCost
        }
      ]
    };

    this.purchaseService.savePurchase(payload).subscribe({
      next: () => {
        this.msg.add({severity:'success', summary:'¡Compra Exitosa!', detail:'Inventario actualizado y dinero descontado'});
        this.limpiar();
        // Recargamos cajas para ver el nuevo saldo reducido
        this.cargarDatos(); 
      },
      error: (err) => {
        // Mostramos el mensaje de error específico (ej: "Fondos Insuficientes")
        const errorDetail = err.error?.detail || JSON.stringify(err.error);
        this.msg.add({severity:'error', summary:'Error al Comprar', detail: errorDetail});
      }
    });
  }

  limpiar() {
    this.selectedProduct = null;
    this.selectedUnit = null;
    this.quantity = 1;
    this.totalCost = 0;
  }
}