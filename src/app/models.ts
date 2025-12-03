export interface Product {
  id: number;
  name: string;
  is_dish: boolean;
  base_unit: string;
  current_stock: number;
  sales_price: number;
}

export interface SaleRequest {
  cash_register?: number; // <--- AGREGA EL '?' AQUÍ (Opcional)
  // O simplemente borra esa línea si prefieres.
  
  items: { 
      dish_id: number; 
      quantity: number; 
      unit_price: number 
  }[];
}