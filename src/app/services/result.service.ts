import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../modal/result';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

private baseUrl = 'http://localhost:8085';


  constructor(private http: HttpClient) {}

 saveResult(result: Result): Observable<string> {
    return this.http.post(`${this.baseUrl}/save`, result, { responseType: 'text' });
}

  getMyResults(): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.baseUrl}/my`);
  }

  getLeaderboard(limit: number = 10): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.baseUrl}/leaderboard`, {
      params: { limit: limit.toString() },
    });
  }}
