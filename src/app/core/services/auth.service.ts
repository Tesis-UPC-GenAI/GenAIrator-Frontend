import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  MessageResponse,
  ResetPasswordPayload,
} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'genai_auth_token';
  private readonly USER_KEY = 'genai_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private baseUrl = `${environment.apiBaseUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  register(data: RegisterData): Observable<AuthResponse> {
    if (!this.isValidEmail(data.email)) {
      return throwError(() => new Error('Email inválido'));
    }

    if (data.password.length < 6) {
      return throwError(() => new Error('La contraseña debe tener al menos 6 caracteres'));
    }

    if (data.password !== data.confirmPassword) {
      return throwError(() => new Error('Las contraseñas no coinciden'));
    }

    const payload = {
      nombre: data.name,
      email: data.email,
      contrasena: data.password,
    };

    return this.http
      .post<{ token: string; usuario: any }>(`${this.baseUrl}/register`, payload)
      .pipe(
        tap((res) => {
          const usuario = res.usuario;
          const user: User = {
            id: String(usuario.usuario_id ?? ''),
            name: usuario.nombre ?? '',
            email: usuario.email ?? '',
          };
          this.saveAuthData(user, res.token);
          this.currentUserSubject.next(user);
        }),
        map((res) => {
          const usuario = res.usuario;
          const user: User = {
            id: String(usuario.usuario_id ?? ''),
            name: usuario.nombre ?? '',
            email: usuario.email ?? '',
          };
          return { user, token: res.token } as AuthResponse;
        }),
      );
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    if (!this.isValidEmail(credentials.email)) {
      return throwError(() => new Error('Email inválido'));
    }

    if (!credentials.password) {
      return throwError(() => new Error('La contraseña es requerida'));
    }

    const payload = {
      email: credentials.email,
      contrasena: credentials.password,
    };

    return this.http.post<{ token: string; usuario: any }>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        const usuario = res.usuario;
        const user: User = {
          id: String(usuario.usuario_id ?? ''),
          name: usuario.nombre ?? '',
          email: usuario.email ?? '',
        };
        this.saveAuthData(user, res.token);
        this.currentUserSubject.next(user);
      }),
      map((res) => {
        const usuario = res.usuario;
        const user: User = {
          id: String(usuario.usuario_id ?? ''),
          name: usuario.nombre ?? '',
          email: usuario.email ?? '',
        };
        return { user, token: res.token } as AuthResponse;
      }),
    );
  }

  forgotPassword(email: string): Observable<MessageResponse> {
    if (!this.isValidEmail(email)) {
      return throwError(() => new Error('Email inválido'));
    }

    return this.http.post<MessageResponse>(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(payload: ResetPasswordPayload): Observable<MessageResponse> {
    if (!this.isValidEmail(payload.email)) {
      return throwError(() => new Error('Email inválido'));
    }

    if (payload.contrasena.length < 6) {
      return throwError(() => new Error('La contraseña debe tener al menos 6 caracteres'));
    }

    if (payload.contrasena !== payload.confirmarContrasena) {
      return throwError(() => new Error('Las contraseñas no coinciden'));
    }

    if (!payload.token?.trim()) {
      return throwError(() => new Error('El enlace de restablecimiento no es válido'));
    }

    return this.http.post<MessageResponse>(`${this.baseUrl}/reset-password`, {
      email: payload.email,
      token: payload.token,
      contrasena: payload.contrasena,
      confirmarContrasena: payload.confirmarContrasena,
    });
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  private saveAuthData(user: User, token: string): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.STORAGE_KEY, token);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
