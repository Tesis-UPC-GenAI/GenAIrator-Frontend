import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GenerationRequest } from '../models/generation-request.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GenerationService {
  private getBaseApi(): string {
    try {
      const win = window as any;
      if (win && win.API_BASE_URL) return win.API_BASE_URL;
    } catch {}
    return 'https://genairator-backend.onrender.com';
  }

  private baseUrl = `${this.getBaseApi()}/api/generation`;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  startGeneration(data: any): Observable<any> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.baseUrl}/start`, data, { headers });
  }

  // New: send FormData for uploads (do not set Content-Type so browser sets boundary)
  startGenerationForm(formData: FormData): Observable<any> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
    return this.http.post<any>(`${this.baseUrl}/start`, formData, { headers });
  }

  getRequests(): Observable<GenerationRequest[]> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<GenerationRequest[]>(`${this.baseUrl}/requests`, { headers }).pipe(
      map((list) =>
        list.map((item) => ({
          ...item,
          status: item.status || (item as any).estado,
          generationRequestId: item.generationRequestId || item.id,
          // token & metric fields mapping (backend returns camelCase)
          totalTokens: (item as any).totalTokens ?? (item as any).tokensAplicados,
          promptTokens: (item as any).promptTokens,
          completionTokens: (item as any).completionTokens,
          componentesGenerados: (item as any).componentesGenerados,
          lineasDeCodigo: (item as any).lineasDeCodigo,
        })),
      ),
    );
  }

  getAllRequests(): Observable<GenerationRequest[]> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<GenerationRequest[]>(`${this.baseUrl}/requests/all`, { headers }).pipe(
      map((list) =>
        list.map((item) => ({
          ...item,
          status: item.status || (item as any).estado,
          generationRequestId: item.generationRequestId || item.id,
          totalTokens: (item as any).totalTokens ?? (item as any).tokensAplicados,
          promptTokens: (item as any).promptTokens,
          completionTokens: (item as any).completionTokens,
          componentesGenerados: (item as any).componentesGenerados,
          lineasDeCodigo: (item as any).lineasDeCodigo,
        })),
      ),
    );
  }

  downloadProject(id: number): Observable<Blob> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.get(`${this.baseUrl}/${id}/download`, {
      headers,
      responseType: 'blob' as 'blob',
    }) as Observable<Blob>;
  }

  getStatus(id: number): Observable<GenerationRequest> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<GenerationRequest>(`${this.baseUrl}/status/${id}`, { headers }).pipe(
      map((item) => ({
        ...item,
        status: (item as any).status || (item as any).estado,
        generationRequestId: (item as any).id || (item as any).generationRequestId,
        totalTokens: (item as any).totalTokens,
        promptTokens: (item as any).promptTokens,
        completionTokens: (item as any).completionTokens,
        componentesGenerados: (item as any).componentesGenerados,
        lineasDeCodigo: (item as any).lineasDeCodigo,
        generationLogs: (item as any).generationLogs || [],
      })),
    );
  }

  deleteProject(id: number): Observable<any> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  pushToGitHub(id: number): Observable<{ repoUrl: string }> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ repoUrl: string }>(`${this.baseUrl}/${id}/push-to-github`, null, {
      headers,
    });
  }
}
