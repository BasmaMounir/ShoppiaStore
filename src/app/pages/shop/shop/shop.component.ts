import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  filteredProduct: Product[] = [];

  searchText: string = '';
  wishlist: any[] = [];
  showWishlist: boolean = false;
  
  toggleWishlist(product: any) {
    const exists = this.wishlist.find(p => p.id === product.id);
    if (!exists) {
      this.wishlist.push(product);
    } else {
      this.wishlist = this.wishlist.filter(p => p.id !== product.id);
    }
  }
  
  isWishlisted(product: any): boolean {
    return this.wishlist.some(p => p.id === product.id);
  }
  
  toggleWishlistPopup() {
    this.showWishlist = !this.showWishlist;
  }
  
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
  filterProducts(): void {
     const text = this.searchText.trim().toLowerCase();
     if (!text) {
       this.filteredProduct = this.products;
     } else {
       this.filteredProduct = this.products.filter(product =>
         product.name.toLowerCase().includes(text)
       );
     }
   }
   

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.data || [];
        this.filteredProduct = this.products;
      },
      error: (error) => console.error('Error loading all products:', error)
    });
  }

  loadProductsByCategoryId(categoryId: number): void {
    this.productService.getProductsByCategoryId(categoryId).subscribe({
      next: (response: any) => {
        this.products = response.data || [];
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

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  addToCart(product: Product): void {
    console.log('Product added to cart:', product.name);
  }

  quickView(product: Product): void {
    console.log('Quick View clicked for:', product.name);
  }

  get filteredProducts(): Product[] {
    if (!this.searchText.trim()) return this.products;
    const text = this.searchText.toLowerCase();
    return this.products.filter(p => p.name.toLowerCase().includes(text));
  }
}
