import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from "../user-management/user-management.component";
import { ProductManagementComponent } from "../product-management/product-management.component";
import { CategoryManagementComponent } from "../category-management/category-management.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, UserManagementComponent, ProductManagementComponent, CategoryManagementComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

        activeSection: string = 'products';

        setActive(section: string) {
          this.activeSection = section;
        }
}
