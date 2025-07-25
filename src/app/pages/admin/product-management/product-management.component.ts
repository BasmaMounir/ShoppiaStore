import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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

  originalProduct: any = {};

  constructor(private http: HttpClient) {}

  activeSection: string = 'load';
  updateProductId: number = 0;
  deleteProductId: number = 0;

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  loadProductForUpdate() {
    const url = `https://catalog-service-production.up.railway.app/products/id/${this.updateProductId}`;
    this.http.get(url, { headers: this.getAuthHeaders() }).subscribe({
      next: (res: any) => {
        this.originalProduct = res.data;
        this.product = { ...res.data };
        if (!this.product.images || !Array.isArray(this.product.images)) {
          this.product.images = [''];
        }
        Swal.fire({
          icon: 'info',
          html: '✅ Product loaded, you can edit now.',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to load product',
          text: err.error?.message || 'Something went wrong',
        });
      },
    });
  }

  updateProduct() {
    const url = `https://catalog-service-production.up.railway.app/products/${this.updateProductId}`;
    const updatedProduct = {
      ...this.originalProduct,
      ...this.product,
    };
    this.http
      .patch(url, updatedProduct, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            html: '✅ Product Updated',
            timer: 3000,
            showConfirmButton: false,
          });
        },
        error: (err) => {
          const message = err.error?.message || 'Something went wrong';
          const data = err.error?.data;
          Swal.fire({
            icon: 'error',
            html: ` ${message}<br>${data ? 'Data: <b>' + data + '</b>' : ''}`,
          });
        },
      });
  }

  deleteProduct() {
    const url = `https://catalog-service-production.up.railway.app/products/${this.deleteProductId}`;
    this.http
      .delete(url, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            html: '🗑️ Product deleted successfully!',
            timer: 3000,
            showConfirmButton: false,
          });
        },
        error: (err) => {
          const message = err.error?.message || 'Something went wrong';
          const data = err.error?.data;
          Swal.fire({
            icon: 'error',
            html: ` ${message}<br>${data ? 'Data: <b>' + data + '</b>' : ''}`,
          });
        },
      });
  }

  addProduct() {
    this.http
      .post(
        'https://catalog-service-production.up.railway.app/products',
        this.product,
        { headers: this.getAuthHeaders() }
      )
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            html: ` ${res.message}<br>New Product ID: <b>${res.data}</b>`,
            timer: 3000,
            showConfirmButton: false,
          });
        },
        error: (err) => {
          const message = err.error?.message || 'Something went wrong';
          const data = err.error?.data;
          Swal.fire({
            icon: 'error',
            html: ` ${message}<br>${data ? 'Data: <b>' + data + '</b>' : ''}`,
          });
        },
      });
  }

  addImageField() {
    if (!this.product.images) {
      this.product.images = [];
    }
    this.product.images.push('');
  }

  removeImageField(index: number) {
    this.product.images.splice(index, 1);
  }
}
