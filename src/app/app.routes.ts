import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop/shop.component';
import { ProductDetailComponent } from './pages/shop/product-detail/product-detail.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AdminGuard } from './admin.guard';
import { AboutComponent } from './pages/about/about.component';
import { StoreDashboardComponent } from './pages/admin/store-dashboard/store-dashboard.component';
import { WarehouseComponent } from './pages/admin/warehouse/warehouse.component';
import { ProductComponent } from './pages/admin/product/product.component';
import { HistoryComponent } from './pages/admin/history/history.component';
import { WarehouseManageComponent } from './pages/admin/warehouse/warehouse-manage.component';
import { StockManageComponent } from './pages/admin/stock-manage/stock-manage.component';
import { ProductManagementComponent } from './pages/admin/product-management/product-management.component';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';
import { CategoryManagementComponent } from './pages/admin/category-management/category-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:categoryId', component: ShopComponent },
  { path: 'product/:productId', component: ProductDetailComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'admin/dashboard',
    canActivate: [AdminGuard],
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ProductManagementComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'category', component: CategoryManagementComponent },
      { path: 'stock', component: StoreDashboardComponent },
      { path: 'store-dashboard', component: StoreDashboardComponent },
      { path: 'warehouses', component: WarehouseComponent },
      { path: 'products-search', component: ProductComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'manage-warehouses', component: WarehouseManageComponent },
      { path: 'manage-stock', component: StockManageComponent },
    ]
  }
];
