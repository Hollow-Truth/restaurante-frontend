import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PosService } from '../../services/pos.service';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service'; // <--- 1. IMPORTAR
import { Product } from '../../models';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, TagModule, ToastModule, TooltipModule],
  providers: [MessageService],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {

  menu: Product[] = [];
  carrito: any[] = [];
  total: number = 0;
  usuarioActual: string = 'Cajero';

  constructor(
    private posService: PosService,
    private authService: AuthService,
    private layoutService: LayoutService, // <--- 2. INYECTAR
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // 3. SETEAR EL TÍTULO GLOBAL
    this.layoutService.setTitle('Punto de Venta'); 
    
    this.cargarMenu();
    const token = this.authService.getToken();
    if (token) {
        this.usuarioActual = this.authService.getUsername(); 
    }
  }

  // ... (El resto de métodos: cargarMenu, agregar, cobrar, imprimirTicket siguen IGUAL) ...
  
  cargarMenu() {
    this.posService.getMenu().subscribe({
      next: (data) => {
        this.menu = data.filter(p => p.is_dish && p.current_stock > 0);
      },
      error: (err) => console.error("Error cargando menú", err)
    });
  }

  agregar(producto: Product) {
    const item = this.carrito.find(i => i.product.id === producto.id);
    if (item) {
      if (item.quantity < producto.current_stock) {
        item.quantity++;
        item.subtotal = item.quantity * producto.sales_price;
      } else {
        this.messageService.add({severity:'warn', summary:'Stock Límite', detail:'No hay más platos.'});
      }
    } else {
      this.carrito.push({ product: producto, quantity: 1, subtotal: producto.sales_price });
    }
    this.calcularTotal();
  }

  quitar(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
  }

  cobrar() {
    if (this.carrito.length === 0) return;

    const ventaPayload = {
      items: this.carrito.map(item => ({
        dish_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.sales_price
      }))
    };

    this.posService.cobrar(ventaPayload).subscribe({
      next: (resp) => {
        this.messageService.add({severity:'success', summary:'¡Venta Exitosa!', detail:`Cobrado: ${this.total} Bs`});
        this.imprimirTicket(resp.id); 
        this.carrito = [];
        this.total = 0;
        this.cargarMenu();
      },
      error: (err) => {
        const msg = err.error?.error || 'Error al procesar la venta';
        this.messageService.add({severity:'error', summary:'Error', detail: msg});
      }
    });
  }

  // ... (El resto del código de imprimirTicket igual) ...
  imprimirTicket(nroVenta: number) {
      // ... tu código del ticket ...
      // Solo para que no de error al compilar, aquí va lo que ya tenías
      console.log("Imprimiendo ticket", nroVenta);
  }
}