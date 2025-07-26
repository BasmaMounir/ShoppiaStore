# ShoppiaStore – Angular Frontend for E-Commerce Microservices

**ShoppiaStore** is a modern frontend application built with **Angular 18**, designed to interact with an e-commerce backend system following a **microservices architecture**.

This project handles user-facing functionality such as authentication, registration, product browsing, and user-specific role-based views.

## 🧩 Key Features

- **Authentication & Authorization** via JWT tokens
- **Login / Register** pages with form validation
- **Role-based UI Rendering** (User / Admin)
- Integration with microservices (User Service, Catalog Service, etc.)
- Responsive UI built with **Bootstrap 5**
- Communication with REST APIs using **Angular HttpClient**
- Token storage and role management via **LocalStorage**

## 🚀 Technologies Used

- **Angular 18 (Standalone Components)**
- **TypeScript**
- **RxJS**
- **Bootstrap 5**
- **JWT-based authentication**
- **REST API Integration**
- **Angular Router & Guards**

## 📁 Folder Structure Highlights

```
src/
├── app/
│   ├── auth/         # Login, Register, Auth Guard
│   ├── user/         # Role-based user actions
│   ├── admin/        # Admin dashboard features
│   ├── shared/       # Shared services & components
```

## 🔌 How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/BasmaMounir/ShoppiaStore.git
   cd ShoppiaStore
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the Angular app:
   ```bash
   ng serve
   ```

4. Visit:
   ```
   http://localhost:4200
   ```

> ⚠️ Make sure backend microservices (Auth, Catalog, etc.) are running and accessible via CORS.
