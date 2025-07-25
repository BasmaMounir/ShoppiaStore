import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss'],
})
export class CategoryManagementComponent {
  constructor(private http: HttpClient) {}

  baseUrl = 'https://catalog-service-production.up.railway.app/categories';

  activeSection: string = 'load';

  loadCategoryId!: number;
  updateCategoryId!: number;
  deleteCategoryId!: number;
  message: string = '';
  error: string = '';

  category = {
    name: '',
    imageUrl: '',
  };

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  loadCategoryById() {
    this.http
      .get(`${this.baseUrl}/category/${this.loadCategoryId}`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (res: any) => {
          this.category = {
            name: res.data?.name || '',
            imageUrl: res.data?.imageUrl || '',
          };
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

  addCategory() {
     if (!this.category.name.trim() || !this.category.imageUrl.trim()) {
          Swal.fire({
               icon: 'error',
               html: "Both name and image URL are required.",
             });
       return;
     }
   
     this.http
       .post(this.baseUrl, this.category, {
         headers: this.getAuthHeaders(),
       })
       .subscribe({
         next: (res: any) => {
           Swal.fire({
             icon: 'success',
             html: ` ${res.message}<br>New Category ID: <b>${res.data}</b>`,
             timer: 3000,
             showConfirmButton: false
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
   

  updateCategory() {
    this.http
      .patch(`${this.baseUrl}/${this.updateCategoryId}`, this.category, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
          next: (res: any) => {
               Swal.fire({
                 icon: 'success',
                 html: "✏️ Category updated successfully!",
                 timer: 3000,
                 showConfirmButton: false
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

  deleteCategory() {
    this.http
      .delete(`${this.baseUrl}/${this.deleteCategoryId}`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
          next: (res: any) => {
          Swal.fire({
               icon: 'success',
               html: "🗑️ Category deleted successfully!",
               timer: 3000,
               showConfirmButton: false
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
}
