import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '../../../models/Store';
import { StockDetails } from '../../../models/StockDetails';
import { HttpClient } from '@angular/common/http';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-stock-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatIconModule, MatSelectModule],
  templateUrl: './stock-manage.component.html',
  styleUrl: './stock-manage.component.css'
})
export class StockManageComponent implements OnInit{

  selectedProduct: number | null = null;
  selectedWarehouse: number | null = null;
  quantity: number | null = null;
  stockList: Store[] = [];

  constructor(private http: HttpClient,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
      this.storeService.getStoreEntries()
      .subscribe( (res: Store[]) => {
        this.stockList = res;
      })
  }

  onAddStock() {

    if (!this.selectedProduct || !this.selectedWarehouse || !this.quantity) {
      alert('Please provide all three values: Product ID, Warehouse ID, and Quantity');
      return;
    }

  
    if (this.quantity <= 0) {
      alert('Quantity must be greater than 0 for adding stock');
      return;
    }

    const stockDetails: StockDetails = {
      productId: this.selectedProduct,
      warehouseId: this.selectedWarehouse,
      quantity: this.quantity
    };

    this.storeService.addStock(stockDetails)
    .subscribe({
      next: () => {
        // Refresh the stock list after successful operation
        this.loadStockList();
        // Reset form
        this.resetForm();
        alert('Stock added successfully!');
      },
      error: (error) => {
        console.error('Error adding stock:', error);
        let errorMessage = 'Error adding stock';
        
        // Try to extract the error message from the backend response
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status === 400) {
          errorMessage = 'Invalid stock data';
        } else if (error.status === 404) {
          errorMessage = 'Product or warehouse not found';
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred';
        }
        
        alert(errorMessage);
      }
    });
  }

  onConsumeStock() {
    console.log('onConsumeStock called');
    
    if (!this.selectedProduct || !this.selectedWarehouse || !this.quantity) {
      alert('Please provide all three values: Product ID, Warehouse ID, and Quantity');
      return;
    }

    if (this.quantity <= 0) {
      alert('Quantity must be greater than 0 for consuming stock');
      return;
    }

    const stockDetails: StockDetails = {
      productId: this.selectedProduct,
      warehouseId: this.selectedWarehouse,
      quantity: this.quantity
    };

    console.log('Sending consume stock request with details:', stockDetails);

     this.storeService.consumeStock(stockDetails)
       .subscribe({
         next: () => {
           console.log('Consume stock successful');
          
           this.loadStockList();
           
           this.resetForm();
           alert('Stock consumed successfully!');
         },
         error: (error) => {
           console.error('Error consuming stock:', error);
           let errorMessage = 'Error consuming stock';
           
           // Try to extract the error message from the backend response
           if (error.error && error.error.message) {
             errorMessage = error.error.message;
           } else if (error.message) {
             errorMessage = error.message;
           } else if (error.status === 400) {
             errorMessage = 'Insufficient stock available';
           } else if (error.status === 404) {
             errorMessage = 'Product or warehouse not found';
           } else if (error.status === 500) {
             errorMessage = 'Server error occurred';
           }
           
           alert(errorMessage);
         }
       });
  }

  private loadStockList() {
    this.storeService.getStoreEntries()
      .subscribe((res: Store[]) => {
        this.stockList = res;
      });
  }

  private resetForm() {
    this.selectedProduct = null;
    this.selectedWarehouse = null;
    this.quantity = null;
  }

} 