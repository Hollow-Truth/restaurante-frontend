import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../services/finance.service';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, ButtonModule, TooltipModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  
  // Inicialización segura
  summary: any = { 
      income: 0, 
      expense: 0, 
      balance: 0, 
      inventory_value: 0, 
      product_count: 0 
  };
  
  chartData: any;
  chartOptions: any;

  constructor(private financeService: FinanceService) {}

  ngOnInit() {
    this.cargarDatos();
    this.configurarGrafico();
  }

  cargarDatos() {
    this.financeService.getReport().subscribe(data => {
      this.summary = data.summary; // Datos reales del Backend

      const dias = data.chart_data.map((d: any) => d.dia);
      const ingresos = data.chart_data.map((d: any) => d.ingreso_dia);
      const egresos = data.chart_data.map((d: any) => d.egreso_dia);

      this.chartData = {
        labels: dias,
        datasets: [
          { label: 'Ingresos', data: ingresos, backgroundColor: '#22c55e', borderRadius: 4 },
          { label: 'Egresos', data: egresos, backgroundColor: '#ef4444', borderRadius: 4 }
        ]
      };
    });
  }

  configurarGrafico() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#64748b' } }
      },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { display: false } },
        y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' }, beginAtZero: true }
      }
    };
  }
}