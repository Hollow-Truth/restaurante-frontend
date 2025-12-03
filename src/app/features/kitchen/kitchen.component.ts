import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KitchenService } from '../../services/kitchen.service';
import { LayoutService } from '../../services/layout.service'; // <--- 1. IMPORTAR

// PrimeNG
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, DropdownModule, InputNumberModule, ButtonModule, TableModule, ToastModule, PanelModule],
  providers: [MessageService],
  templateUrl: './kitchen.component.html'
})
export class KitchenComponent implements OnInit {
  protected Math = Math;
  // ... (Tus variables de siempre: platos, insumos, etc.) ...
  platos: any[] = [];
  insumos: any[] = [];
  selectedDish: any;
  quantityCooked: number = 10;
  currentIngredients: any[] = [];
  tempIngredient: any;
  tempQty: number = 1;

  constructor(
    private kitchenService: KitchenService, 
    private msg: MessageService,
    private layoutService: LayoutService // <--- 2. INYECTAR
  ) {}

  ngOnInit() {
    this.layoutService.setTitle('Cocina - Producción'); // <--- 3. SETEAR TÍTULO
    this.cargarDatos();
  }

  // ... (El resto del código: cargarDatos, agregarIngrediente, guardarProduccion, etc. SIGUE IGUAL) ...
  cargarDatos() {
    this.kitchenService.getIngredients().subscribe(data => {
      this.platos = data.filter(p => p.is_dish === true);
      this.insumos = data.filter(p => p.is_dish === false && p.current_stock > 0);
    });
  }

  agregarIngrediente() {
    if (!this.tempIngredient || this.tempQty <= 0) return;
    const exists = this.currentIngredients.find(i => i.ingredient.id === this.tempIngredient.id);
    if (exists) {
        this.msg.add({severity:'warn', summary:'Ya agregado', detail:'Ese ingrediente ya está en la lista'});
        return;
    }
    if (this.tempQty > this.tempIngredient.current_stock) {
        this.msg.add({severity:'error', summary:'Stock Insuficiente', detail:`Solo tienes ${this.tempIngredient.current_stock} de ${this.tempIngredient.name}`});
        return;
    }
    this.currentIngredients.push({ ingredient: this.tempIngredient, quantity: this.tempQty });
    this.tempIngredient = null;
    this.tempQty = 1;
  }

  borrarIngrediente(index: number) {
    this.currentIngredients.splice(index, 1);
  }

  guardarProduccion() {
    if (!this.selectedDish || this.currentIngredients.length === 0) {
        this.msg.add({severity:'warn', summary:'Faltan datos', detail:'Selecciona un plato y al menos un ingrediente'});
        return;
    }
    const payload = {
        dish_id: this.selectedDish.id,
        quantity_produced: this.quantityCooked,
        ingredients_used: this.currentIngredients.map(i => ({
            ingredient_id: i.ingredient.id,
            quantity_used: i.quantity
        }))
    };
    this.kitchenService.saveProduction(payload).subscribe({
        next: () => {
            this.msg.add({severity:'success', summary:'¡Cocinado!', detail:`Se crearon ${this.quantityCooked} ${this.selectedDish.name}`});
            this.limpiarFormulario();
            this.cargarDatos();
        },
        error: (err) => {
            this.msg.add({severity:'error', summary:'Error', detail:'No se pudo registrar la cocina'});
        }
    });
  }

  limpiarFormulario() {
    this.selectedDish = null;
    this.quantityCooked = 10;
    this.currentIngredients = [];
  }
}