import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-management.component.html',
})
export class ProductManagementComponent {
  product = {
    name: '',
    description: '',
    imageCover: '',
    images: [''],
    price: 0,
    ratingsAverage: 0,
    categoryId: 1,
  };

  constructor(private http: HttpClient) {}
  activeSection: string = 'load';
  updateProductId: number = 0;
  deleteProductId: number = 0;
  loadProductId: number = 0;

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  loadProductById() {
    const url = `http://localhost:8085/products/id/${this.loadProductId}`;
    this.http.get<any>(url).subscribe({
      next: (product) => {
        this.updateProductId = this.loadProductId;
        this.product = {
          name: product.name,
          description: product.description,
          imageCover: product.imageCover,
          images: product.images,
          price: product.price,
          ratingsAverage: product.ratingsAverage,
          categoryId: product.category.id,
        };
      },
      error: (err) => alert('Error loading product ❌' + err),
    });
  }

  updateProduct() {
     const url = `http://localhost:8085/products/${this.updateProductId}`;
     console.log("Product Sent 📨", this.product); 
   
     this.http.patch(url, this.product, {
       headers: this.getAuthHeaders(),
     })
     .subscribe({
       next: (res) => alert('✅ Product Updated'+ res),
       error: (err) => alert('❌ Error Updating Product:'+ err),
     });
   }
   
   

  deleteProduct() {
    const url = `http://localhost:8085/products/${this.deleteProductId}`;
    this.http
      .delete(url, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (res) => alert('Product Deleted ✅' + res),
        error: (err) => alert('Error ❌' + err),
      });
  }

  addProduct() {
    this.http
      .post('http://localhost:8085/products', this.product, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (res) => {
          alert('✅ Product added successfully!');
        },
        error: (err) => {
          alert('❌ Failed to add product.' + err);
        },
      });
  }

  addImageField() {
    this.product.images.push('');
  }

  removeImageField(index: number) {
    this.product.images.splice(index, 1);
  }
}
