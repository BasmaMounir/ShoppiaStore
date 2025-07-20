import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';

import { StoreService } from '../../../services/store.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../../models/ProductDto';
import { StoreByProduct } from '../../../models/StoreByProduct';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatTableModule, MatFormFieldModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  
  products: Product[] = [];
  productId: number | null = null;
  stockList: StoreByProduct[] = [];
  displayedColumns: string[] = ['warehouseId', 'location', 'quantity', 'updatedAt'];

  constructor(private http: HttpClient,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
      this.storeService.getAllProducts().subscribe(
        (res: Product[]) => {
          this.products = res;
        }
      )
  }

  onProductSelect(){

    if(this.productId != null){
      this.storeService.getStoreEntriesByProduct(this.productId)
      .subscribe( (res: StoreByProduct[]) => {
        this.stockList = res;
      })
    }
  }
}
