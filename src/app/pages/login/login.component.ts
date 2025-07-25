// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

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
   
       this.authService.login({ email, password }).subscribe({
         next: (response) => {
           const roles = this.authService.getUserRoles();
   
           Swal.fire({
             icon: 'success',
             title: 'Login Successful',
             timer: 1500,
             showConfirmButton: false,
           }).then(() => {
             if (roles.includes('ROLE_ADMIN')) {
               this.router.navigate(['/admin/dashboard']);
             } else {
               this.router.navigate(['/']);
             }
           });
         },
         error: (err: any) => {
           console.error('Login error:', err);
           Swal.fire({
             icon: 'error',
             title: 'Login Failed',
             text: err.error?.message || 'Please check your email and password.',
           });
         }
       });
   
     } else {
       this.loginForm.markAllAsTouched();
   
       Swal.fire({
         icon: 'warning',
         title: 'Invalid Input',
         text: 'Please enter a valid email and password.',
       });
     }
   }
   
   

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
