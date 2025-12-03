import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarModule, ButtonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  items: any[] = [];
  currentUser: string = '';
  role: string = '';

  // Conectamos la propiedad sidebarVisible con el servicio compartido
  // Esto permite que el botón del Header abra este menú
  get sidebarVisible() {
    return this.layout.sidebarVisible();
  }
  set sidebarVisible(val: boolean) {
    this.layout.sidebarVisible.set(val);
  }

  constructor(
    private auth: AuthService, 
    private router: Router,
    public layout: LayoutService
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getUsername();
    this.role = this.auth.getUserRole();
    this.generarMenu();
  }

  generarMenu() {
    this.items = [];

    // 1. ADMIN (Gerente) - Ve todo
    if (this.auth.isAdmin()) {
      this.items = [
        { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
        { label: 'Punto de Venta', icon: 'pi pi-shopping-bag', routerLink: '/pos' },
        { label: 'Cocina', icon: 'pi pi-box', routerLink: '/kitchen' },
        { label: 'Caja Inicial', icon: 'pi pi-dollar', routerLink: '/finance/caja' }, 
        { label: 'Compras', icon: 'pi pi-shopping-cart', routerLink: '/inventory/compras' },
        { label: 'Gastos', icon: 'pi pi-wallet', routerLink: '/finance/sueldos' },
        { label: 'Movimientos', icon: 'pi pi-list', routerLink: '/finance/movimientos' },
        { label: 'Personal', icon: 'pi pi-users', routerLink: '/admin/users' }
      ];
    } 
    
    // 2. CAJERO - Solo Venta
    else if (this.role === 'CASHIER') {
      this.items = [
        { label: 'Punto de Venta', icon: 'pi pi-shopping-bag', routerLink: '/pos' }
      ];
    } 
    
    // 3. COCINERO - Solo Cocina
    else if (this.role === 'COOK') {
      this.items = [
        { label: 'Cocina', icon: 'pi pi-box', routerLink: '/kitchen' }
      ];
    }
  }

  navegar(item: any) {
    if (item.routerLink) {
        this.router.navigate([item.routerLink]);
        // Cerramos el menú móvil automáticamente al navegar
        this.layout.sidebarVisible.set(false);
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    this.auth.logout();
  }
}