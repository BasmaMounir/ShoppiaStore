// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLoginSubmit(): void {
     if (this.loginForm.valid) {
       const { email, password } = this.loginForm.value;
       this.errorMessage = '';
   
       this.authService.login({ email, password }).subscribe({
         next: (response) => {
           const roles = this.authService.getUserRoles();
   
           if (roles.includes('ROLE_ADMIN')) {
             this.router.navigate(['/admin/dashboard']);
           } else {
             this.router.navigate(['/']);
           }
   
           // window.location.reload();
         },
         error: (err: any) => {
           console.error('Login error:', err);
           this.errorMessage = err.message || 'Login failed. Please check your credentials.';
         }
       });
   
     } else {
       this.errorMessage = 'Please enter valid email and password.';
       this.loginForm.markAllAsTouched();
     }
   }
   

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
