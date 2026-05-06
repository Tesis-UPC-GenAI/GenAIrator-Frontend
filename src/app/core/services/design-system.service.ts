import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DesignSystemService {
  private baseUrl = `${environment.apiBaseUrl}/api/designsystem`;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  getDesignSystems(): Observable<any[]> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.get<any[]>(this.baseUrl, { headers });
  }

  uploadDesignSystem(file: File): Observable<any> {
    const form = new FormData();
    form.append('file', file, file.name);

    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.post<any>(`${this.baseUrl}/upload`, form, { headers });
  }
}
