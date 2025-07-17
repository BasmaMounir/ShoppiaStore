import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, map, of, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse, RegisterResponse, User } from '../models/auth';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private usersApiUrl = 'http://localhost:8080/users';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private _roleCheckTrigger = new BehaviorSubject<void>(undefined);
  public isAdmin$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserSubject = new BehaviorSubject<User | null>(this.getToken() ? { email: '', token: this.getToken()! } as User : null);
    } else {
      this.currentUserSubject = new BehaviorSubject<User | null>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();

    this.isAdmin$ = combineLatest([
      this.currentUser,
      this._roleCheckTrigger
    ]).pipe(
      switchMap(([user, _]) => {
        if (user && user.token && this.isLoggedIn()) {
          return of(this.hasRole('ROLE_ADMIN'));
        }
        return of(false);
      }),
      distinctUntilChanged()
    );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(user: User): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, user).pipe(
      tap(() => {}),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred during registration.';
        if (error.error && typeof error.error === 'object' && 'message' in error.error) {
          errorMessage = error.error.message;
        } else if (error.error) {
          errorMessage = JSON.stringify(error.error);
        } else if (error.message) {
          errorMessage = error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authToken', response.token);
            this.currentUserSubject.next({ email: credentials.email, token: response.token } as User);
            this._roleCheckTrigger.next();
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred during login.';
        if (error.error && typeof error.error === 'object' && 'message' in error.error) {
          errorMessage = error.error.message;
        } else if (error.error) {
          errorMessage = JSON.stringify(error.error);
        } else if (error.message) {
          errorMessage = error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
    this.currentUserSubject.next(null);
    this._roleCheckTrigger.next();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      return token !== null && !this.isTokenExpired(token);
    }
    return false;
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    const expirationTimeInMs = payload.exp * 1000;
    return expirationTimeInMs < new Date().getTime();
  }

  public getUserRoles(): string[] {
     const token = this.getToken();
     const payload = token ? this.decodeToken(token) : null;
   
     if (payload) {
       if (typeof payload.role === 'string') {
         return [payload.role];
       }
   
       if (Array.isArray(payload.role)) {
         return payload.role;
       }
     }
   
     return [];
   }
   

  public hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }
}
