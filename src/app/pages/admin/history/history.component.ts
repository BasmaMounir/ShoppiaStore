import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { HistoryService } from '../../../services/history.service';
import { StoreService } from '../../../services/store.service';
import { WarehouseService } from '../../../services/warehouse.service';
import { Product } from '../../../models/ProductDto';
import { Warehouse } from '../../../models/Warehouse';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { History } from '../../../models/History';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule,
     MatSelectModule, MatTableModule, MatIcon, MatInputModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit{

  products: Product[] = [];
  warehouses: Warehouse[] = [];
  historyRecords: History[] = [];
  productId?: number;
  warehouseId?: number;
  displayedColumns: string[] = ['productId', 'warehouse', 'operation',
     'quantityChanged', 'createdAt', 'delete'];

  bulkDeleteProductId: number | null = null;
  bulkDeleteWarehouseId: number | null = null;
  bulkDeleteBothProductId: number | null = null;
  bulkDeleteBothWarehouseId: number | null = null;

  constructor(private http: HttpClient,
    private historyService: HistoryService,
    private storeService: StoreService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
      this.storeService.getAllProducts().subscribe(
        (res: Product[]) => {
          this.products = res;
        }
      )

      this.warehouseService.getAllLocations().subscribe(
        (res: Warehouse[]) => {
          this.warehouses = res;
        }
      )
  }

  onFilterSubmit(){
    this.historyService.getRecordsBy(this.warehouseId, this.productId)
    .subscribe( (res: History[]) => {
        this.historyRecords = res;
      }
    )
  }

  
  onBulkDeleteByProductId() {
    if(this.bulkDeleteProductId == null || this.bulkDeleteProductId === 0){
      alert('Please enter a Product ID to delete records');
      return;
    }
    
    this.historyService.deleteRecordsBy(null, Number(this.bulkDeleteProductId))
    .subscribe({
      next: () => {
        // Refresh the history records after successful operation
        this.onFilterSubmit();
        // Reset form
        this.bulkDeleteProductId = null;
        alert('Records deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting records:', error);
        let errorMessage = 'Error deleting records';
        
        // Try to extract the error message from the backend response
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status === 404) {
          errorMessage = 'No records found with this product ID';
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred';
        }
        
        alert(errorMessage);
      }
    });
  }
  onBulkDeleteByWarehouseId() {
    if(this.bulkDeleteWarehouseId == null || this.bulkDeleteWarehouseId === 0){
      alert('Please enter a Warehouse ID to delete records');
      return;
    }
    
    this.historyService.deleteRecordsBy(Number(this.bulkDeleteWarehouseId), null)
    .subscribe({
      next: () => {
        // Refresh the history records after successful operation
        this.onFilterSubmit();
        // Reset form
        this.bulkDeleteWarehouseId = null;
        alert('Records deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting records:', error);
        let errorMessage = 'Error deleting records';
        
        // Try to extract the error message from the backend response
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status === 404) {
          errorMessage = 'No records found with this warehouse ID';
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred';
        }
        
        alert(errorMessage);
      }
    });
  }
  onBulkDeleteByProductAndWarehouse() {
    if(this.bulkDeleteBothProductId == null || this.bulkDeleteBothProductId === 0){
      alert('Please enter a Product ID to delete records');
      return;
    }
    
    if(this.bulkDeleteBothWarehouseId == null || this.bulkDeleteBothWarehouseId === 0){
      alert('Please enter a Warehouse ID to delete records');
      return;
    }
    
    this.historyService.deleteRecordsBy(Number(this.bulkDeleteBothWarehouseId),
      Number(this.bulkDeleteBothProductId))
      .subscribe({
        next: () => {
          // Refresh the history records after successful operation
          this.onFilterSubmit();
          // Reset form
          this.bulkDeleteBothProductId = null;
          this.bulkDeleteBothWarehouseId = null;
          alert('Records deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting records:', error);
          let errorMessage = 'Error deleting records';
          
          // Try to extract the error message from the backend response
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status === 404) {
            errorMessage = 'No records found with this product and warehouse combination';
          } else if (error.status === 500) {
            errorMessage = 'Server error occurred';
          }
          
          alert(errorMessage);
        }
      });
  }

  onDeleteRecord(record: History){
    this.historyService.deleteRecordsBy(record.warehouseId, record.productId)
    .subscribe(() => {
      // Refresh the history records after successful operation
      this.onFilterSubmit();
      alert('Record deleted successfully!');
    }, (error) => {
      alert('Error deleting record: ' + error.message);
    });
  }
}
