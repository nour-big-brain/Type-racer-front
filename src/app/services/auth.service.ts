// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../modal/user';

export interface SignUpResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8085/auth';

  constructor(private http: HttpClient) {}

  signUp(user: User): Observable<string> {
    return this.http.post(`${this.baseUrl}/signUp`, user, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.error('SignUp error:', err.status, err.error);
        return throwError(() => new Error(err.error?.message || 'SignUp failed'));
      })
    );
  }

  login(user: User): Observable<string> {
    return this.http.post(`${this.baseUrl}/login`, user, { responseType: 'text' }).pipe(
      tap((token: string) => {
        // Validate and store token
        if (token && typeof token === 'string' && token.trim().length > 0) {
          this.setToken(token.trim());
        } else {
          throw new Error('Invalid token received from server');
        }
      }),
      catchError((err) => {
        console.error('Login error:', err.status, err.error);
        return throwError(() => new Error(err.error?.message || 'Login failed'));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}