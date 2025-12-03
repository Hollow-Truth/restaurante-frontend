import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { PosComponent } from './features/pos/pos.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { KitchenComponent } from './features/kitchen/kitchen.component';
import { PurchasesComponent } from './features/purchases/purchases.component';
import { CashRegisterComponent } from './features/finance/cash-register/cash-register.component';
import { TransactionsComponent } from './features/finance/transactions/transactions.component';
import { ExpensesComponent } from './features/finance/expenses/expenses.component';
import { authGuard } from './guards/auth.guard';
import { UserFormComponent } from './features/users/user-form/user-form.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    
    // --- ZONA 1: CAJEROS Y ADMINS ---
    { 
        path: 'pos', 
        component: PosComponent, 
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'CASHIER'] } // Solo Cajeros y Admins
    },

    // --- ZONA 2: COCINEROS Y ADMINS ---
    { 
        path: 'kitchen', 
        component: KitchenComponent, 
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'COOK'] } // Solo Cocineros y Admins
    },

    // --- ZONA 3: SOLO GERENCIA (ADMIN) ---
    // Agrupamos todas las rutas admin bajo un solo guardián
    { 
        path: '', 
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }, // <--- ESTO ES EL CANDADO MAESTRO
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'inventory/compras', component: PurchasesComponent },
            { path: 'finance/caja', component: CashRegisterComponent },
            { path: 'finance/movimientos', component: TransactionsComponent },
            { path: 'finance/sueldos', component: ExpensesComponent },
            { path: 'admin/users', component: UserFormComponent, canActivate: [authGuard] },
        ]
    },

    // Cualquier ruta desconocida -> Login
    { path: '**', redirectTo: 'login' }
];