import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  mainImageUrl: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('productId');
      if (productId) {
        this.loadProductDetails(+productId);
      }
    });
  }

  loadProductDetails(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.product = response.data;
          if (this.product!.imageCover) {
            this.mainImageUrl = this.product!.imageCover;
          } else if (this.product!.images?.length) {
            this.mainImageUrl = this.product!.images[0];
          }
        }
      },
      error: (error) => console.error('Error loading product details:', error)
    });
  }

  changeMainImage(imageUrl: string): void {
    this.mainImageUrl = imageUrl;
  }

  incrementQty(): void {
    this.quantity++;
  }

  decrementQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(product: Product | null): void {
    if (product) {
      console.log(`Added ${this.quantity} of '${product.name}' to cart.`);
      // Add your cart service logic here if needed
    }
  }
  getArrayFromNumber(count: number): number[] {
     return Array(count).fill(0);
   }
   

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
