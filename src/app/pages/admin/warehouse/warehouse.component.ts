import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { WarehouseService } from '../../../services/warehouse.service';
import { Warehouse } from '../../../models/Warehouse';
import { StoreService } from '../../../services/store.service';
import { StoreByWarehouse } from '../../../models/StoreByWarehouse';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.css',
})
export class WarehouseComponent implements OnInit {

  warehouses: Warehouse[] = [];
  warehouseId: number | null = null;
  stockList: StoreByWarehouse[] = [];

  constructor(
    private warehouseService: WarehouseService,
    private storeService: StoreService
  ) {}

    ngOnInit(): void {
    this.warehouseService.getAllLocations().subscribe((res: Warehouse[]) => {
      this.warehouses = res;
    });
  }

  onWarehouseSelect() {

    if(this.warehouseId != null){

    this.storeService.getStoreEntriesByWarehouse(this.warehouseId)
    .subscribe((res: StoreByWarehouse[]) => {
      this.stockList = res;
    });
    
  }
}

}
