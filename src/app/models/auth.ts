export interface User {
     id?: number;
     email: string;
     password?: string;
     firstName?: string;
     lastName?: string;
     phone?: string;
     address?: string;
     role?: string;
     token?: string;
   }
   
   export interface LoginResponse {
     token: string;
   }
   
   export interface RegisterResponse {
     message: string;
   }