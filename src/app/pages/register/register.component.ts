import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    
  ]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  roles: string[] = ['ROLE_USER', 'ROLE_ADMIN'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d).{8,}$/)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      address: ['', Validators.required]
    });
  }

  onRegisterSubmit(): void {
     if (this.registerForm.valid) {
       const newUser: User = this.registerForm.value;
   
       this.authService.register(newUser).subscribe({
         next: (response) => {
           console.log('Registration successful:', response);
           
           Swal.fire({
             icon: 'success',
             title: 'Registered Successfully',
             text: 'You can now login!',
             timer: 2000,
             showConfirmButton: false
           });
   
           this.registerForm.reset({ role: 'User' });
           this.router.navigate(['/login']);
         },
         error: (err: any) => {
           console.error('Registration error:', err);
           
           Swal.fire({
             icon: 'error',
             title: 'Registration Failed',
             text: err.error?.message || 'Something went wrong. Please try again.'
           });
         }
       });
   
     } else {
       this.registerForm.markAllAsTouched();
   
       Swal.fire({
         icon: 'warning',
         title: 'Invalid Input',
         text: 'Please fill all required fields correctly.'
       });
     }
   }
   

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get phoneNumber() { return this.registerForm.get('phoneNumber'); }
  get address() { return this.registerForm.get('address'); }
}