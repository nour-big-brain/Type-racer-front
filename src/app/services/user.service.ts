import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../modal/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 private baseUrl = 'http://localhost:8085';

  constructor(private http: HttpClient) {}

   getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/username/${username}`);
  }}
