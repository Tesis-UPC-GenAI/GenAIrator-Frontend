import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:5000/api/user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {}

  savePat(gitHubPat: string | null): Observable<any> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.baseUrl}/save-pat`, { gitHubPat }, { headers }).pipe(
      tap(() => {
        // refresh current user after saving PAT to update subscribers
        this.getMe().subscribe({ next: (u) => this.setCurrentUserFromApi(u), error: () => {} });
      })
    );
  }

  getMe(): Observable<any> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(`${this.baseUrl}/me`, { headers }).pipe(
      tap((u: any) => {
        this.setCurrentUserFromApi(u);
      })
    );
  }

  private setCurrentUserFromApi(u: any) {
    if (!u) {
      this.currentUserSubject.next(null);
      return;
    }

    const user: User = {
      id: String(u.id ?? ''),
      name: u.nombre ?? u.name ?? '',
      email: u.email ?? '',
      gitHubPatExists: !!u.gitHubPatExists,
    };

    this.currentUserSubject.next(user);
  }
}
