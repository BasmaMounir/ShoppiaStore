import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { WarehouseService } from '../../../services/warehouse.service';
import { Warehouse } from '../../../models/Warehouse';

@Component({
  selector: 'app-warehouse-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatIconModule],
  templateUrl: './warehouse-manage.component.html',
  styleUrl: './warehouse-manage.component.css'
})
export class WarehouseManageComponent implements OnInit{
  newWarehouseLocation: string = '';
  warehouses: Warehouse[] = [];

  constructor(private http: HttpClient,
    private warehouseService: WarehouseService
  ){}

  ngOnInit(): void {
      this.warehouseService.getAllLocations()
      .subscribe( (res: Warehouse[]) => {
        this.warehouses = res;
      })
  }

  onCreateWarehouse() {
    if(this.newWarehouseLocation != null && this.newWarehouseLocation.trim() !== ''){
      this.warehouseService.addLocation(this.newWarehouseLocation)
      .subscribe(() => {
        // Refresh the warehouse list after successful operation
        this.loadWarehouses();
        // Reset form
        this.newWarehouseLocation = '';
        alert('Warehouse created successfully!');
      }, (error) => {
        alert('Error creating warehouse: ' + error.message);
      });
    } else {
      alert('Please enter a warehouse location');
    }
  }

  onDeleteWarehouse(warehouse: Warehouse) {
    this.warehouseService.deleteWarehouse(Number(warehouse.warehouseId))
    .subscribe(() => {
      // Refresh the warehouse list after successful operation
      this.loadWarehouses();
      alert('Warehouse deleted successfully!');
    }, (error) => {
      alert('Error deleting warehouse: ' + error.message);
    });
  }

  private loadWarehouses() {
    this.warehouseService.getAllLocations()
      .subscribe((res: Warehouse[]) => {
        this.warehouses = res;
      });
  }
} 