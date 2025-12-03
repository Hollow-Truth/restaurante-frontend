import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../services/layout.service';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  
  constructor(
    public layoutService: LayoutService, // Público para usarlo en el HTML
    public auth: AuthService
  ) {}

}