import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GenerationService {
  private baseUrl = 'http://localhost:5000/api/generation';

  constructor(private http: HttpClient, private auth: AuthService) {}

  startGeneration(data: any): Observable<any> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.baseUrl}/start`, data, { headers });
  }

  getRequests(): Observable<any[]> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<any[]>(`${this.baseUrl}/requests`, { headers });
  }
}
