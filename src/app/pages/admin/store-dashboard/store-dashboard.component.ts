import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { StoreService } from '../../../services/store.service';
import { WarehouseService } from '../../../services/warehouse.service';

@Component({
  selector: 'app-store-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './store-dashboard.component.html',
  styleUrl: './store-dashboard.component.css'
})
export class StoreDashboardComponent implements OnInit{

  totalWarehouses = 0;
  totalProducts = 0;
  totalStock = 0;
  
  constructor(private storeService: StoreService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
      console.log('🔍 Store Dashboard: Starting to load data...');
      console.log('🔍 Token from localStorage:', localStorage.getItem('authToken'));
      this.loadDashboardData();
  }

  private loadDashboardData() {
    console.log('🔍 Loading warehouse count...');
    this.warehouseService.getNumberOfWarehouses()
      .subscribe({
        next: (res: number) => {
          console.log('✅ Warehouse count loaded:', res);
          this.totalWarehouses = res;
        },
        error: (error) => {
          console.error('❌ Error loading warehouse count:', error);
        }
      });

    console.log('🔍 Loading product count...');
    this.storeService.getNumberOfProducts()
      .subscribe({
        next: (res: number) => {
          console.log('✅ Product count loaded:', res);
          this.totalProducts = res;
        },
        error: (error) => {
          console.error('❌ Error loading product count:', error);
        }
      });

    console.log('🔍 Loading total stock...');
    this.storeService.getTotalStockOfStores()
      .subscribe({
        next: (res: number) => {
          console.log('✅ Total stock loaded:', res);
          this.totalStock = res;
        },
        error: (error) => {
          console.error('❌ Error loading total stock:', error);
        }
      });
  }

  // Method to refresh dashboard data (can be called from other components if needed)
  public refreshDashboard() {
    console.log('🔄 Refreshing dashboard data...');
    this.loadDashboardData();
  }
}
