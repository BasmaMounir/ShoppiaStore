import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.categories = response.data;
        }
      },
      error: (error) => console.error('Error loading categories for filter:', error)
    });

    this.route.queryParamMap.subscribe(params => {
      const categoryIdParam = params.get('category');
      if (categoryIdParam) {
        this.selectedCategoryId = +categoryIdParam;
        this.loadProductsByCategoryId(this.selectedCategoryId);
      } else {
        this.selectedCategoryId = null;
        this.loadAllProducts();
      }
    });
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.products = response.data;
        } else {
          this.products = [];
        }
      },
      error: (error) => console.error('Error loading all products:', error)
    });
  }

  loadProductsByCategoryId(categoryId: number): void {
    this.productService.getProductsByCategoryId(categoryId).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.products = response.data;
        } else {
          this.products = [];
        }
      },
      error: (error) => console.error(`Error loading products for category ${categoryId}:`, error)
    });
  }

  filterByCategory(categoryId: number | null): void {
    if (categoryId === null) {
      this.selectedCategoryId = null;
      this.router.navigate(['/shop']);
    } else {
      this.selectedCategoryId = categoryId;
      this.router.navigate(['/shop'], { queryParams: { category: categoryId } });
    }
  }

  // >>>>>> Add these methods back to ShopComponent <<<<<<
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  addToCart(product: Product): void {
    console.log('Product added to cart:', product.name);
    // Add your cart service logic here
  }

  quickView(product: Product): void {
    console.log('Quick View clicked for:', product.name);
    // Logic for opening a modal or showing quick view details
  }
  // >>>>>> End of added methods <<<<<<
}