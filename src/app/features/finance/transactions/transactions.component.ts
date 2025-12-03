import { Component, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { FinanceService } from '../../../services/finance.service';
    
    // PrimeNG
    import { TableModule } from 'primeng/table';
    import { TagModule } from 'primeng/tag';
    import { CardModule } from 'primeng/card';
    import { ButtonModule } from 'primeng/button';

    @Component({
      selector: 'app-transactions',
      standalone: true,
      imports: [CommonModule, TableModule, TagModule, CardModule, ButtonModule],
      templateUrl: './transactions.component.html'
    })
    export class TransactionsComponent implements OnInit {
      movimientos: any[] = [];

      constructor(private financeService: FinanceService) {}

      ngOnInit() {
        this.cargarDatos();
      }

      cargarDatos() {
        this.financeService.getTransactions().subscribe(data => {
          this.movimientos = data;
        });
      }
    }