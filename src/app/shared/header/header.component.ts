import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isLoggedIn: boolean = false;
  isAdmin$: Observable<boolean>;
  showProfileMenu = false;

  constructor(private authService: AuthService) {
    this.isAdmin$ = this.authService.isAdmin$;
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      console.log('👤 currentUser from header:', user);
      this.isLoggedIn = !!user?.token;

      if (user?.email && user?.token) {
        this.authService.getAllUsers().subscribe({
          next: (response) => {
            const matchedUser = response.find((u: any) => u.email === user.email);
            if (matchedUser) {
              this.currentUser = matchedUser;
              console.log('✅ Full user data:', matchedUser);
            } else {
              console.warn('⚠️ No user matched with email:', user.email);
            }
          },
          error: (err) => {
            console.error('❌ Error fetching users:', err);
          }
        });
      }
    });

    this.authService.isAdmin$.subscribe(isAdmin => {
      console.log('🛡️ isAdmin from header:', isAdmin);
    });
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout(): void {
    this.authService.logout();
  }
}
