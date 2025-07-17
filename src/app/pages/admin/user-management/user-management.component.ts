import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  enabled: boolean;
  role: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  fetchUsers() {
     this.http.get<User[]>('http://localhost:8080/users', {
       headers: this.getAuthHeaders()
     }).subscribe(users => {
       console.log('Fetched users:', users);
       this.users = users;
     });
   }
   

  activateUser(id: number) {
    this.http.put(`http://localhost:8080/users/${id}/activate`, {}, {
      headers: this.getAuthHeaders()
    }).subscribe(() => this.fetchUsers());
  }

  deactivateUser(id: number) {
    this.http.put(`http://localhost:8080/users/${id}/deactivate`, {}, {
      headers: this.getAuthHeaders()
    }).subscribe(() => this.fetchUsers());
  }

  deleteUser(id: number) {
     this.http.delete(`http://localhost:8080/users/${id}/delete`, {
       headers: this.getAuthHeaders()
     }).subscribe(() => {
       this.users = this.users.filter(user => user.id !== id); 
       this.fetchUsers(); 
     });
   }
   
   
   updateRole(user: User, newRole: string) {
     this.http.put(`http://localhost:8080/users/${user.id}/role`, {
       role: newRole
     }, {
       headers: this.getAuthHeaders(),
       responseType: 'text'
     }).subscribe(() => {
       this.fetchUsers(); 
     });
   }
   
   
   
}
