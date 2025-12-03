import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

// --- IMPORTAR LOS COMPONENTES DE LAYOUT ---
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HeaderComponent } from './shared/header/header.component'; // <--- ESTE FALTABA

@Component({
  selector: 'app-root',
  standalone: true,
  // --- AGREGARLO AQUÍ TAMBIÉN 👇 ---
  imports: [CommonModule, RouterOutlet, NavbarComponent, HeaderComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showNavbar = false;

  constructor(private router: Router) {
    // Detectar cambio de ruta para ocultar menú en login
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNavbar = !event.url.includes('/login');
    });
  }
}