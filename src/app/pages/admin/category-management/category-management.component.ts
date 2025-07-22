import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
             name: res.name,
             imageUrl: res.imageUrl,
           };
           alert('Category Loaded ✅'+ res.data.name);
         },
         error: (err) => {
           console.error('Error ❌', err);
         },
       });
   }
   

  addCategory() {
    this.http.post(this.baseUrl, this.category, {
     headers: this.getAuthHeaders()
   }).subscribe({
      next: () => alert('✅ Category added successfully!'),
      error: (err) => console.error('Error adding category:', err),
    });
  }

  updateCategory() {
    this.http
      .patch(`${this.baseUrl}/${this.updateCategoryId}`, this.category, {
          headers: this.getAuthHeaders()
        })
      .subscribe({
        next: () => alert('✏️ Category updated successfully!'),
        error: (err) => console.error('Error updating category:', err),
      });
  }

  deleteCategory() {
    this.http.delete(`${this.baseUrl}/${this.deleteCategoryId}`, {
     headers: this.getAuthHeaders()
   }).subscribe({
      next: () => alert('🗑️ Category deleted successfully!'),
      error: (err) => console.error('Error deleting category:', err),
    });
  }
}
