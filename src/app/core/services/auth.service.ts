import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../models/user.model';

/**
 * Servicio de autenticación que llama al backend .NET Core
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'genai_auth_token';
  private readonly USER_KEY = 'genai_user';

  // Estado reactivo del usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Base URL del backend. Se puede sobrescribir en tiempo de despliegue con
  // `window.API_BASE_URL` (por ejemplo: https://genairator-backend.onrender.com)
  private getBaseApi(): string {
    try {
      const win = window as any;
      if (win && win.API_BASE_URL) return win.API_BASE_URL;
    } catch {}
    return 'https://genairator-backend.onrender.com';
  }

  private baseUrl = `${this.getBaseApi()}/api/auth`;

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

  /**
   * Registro: llama a POST /api/auth/register
   * Mapea los nombres de campos al contrato del backend (nombre, email, contraseña)
   */
  register(data: RegisterData): Observable<AuthResponse> {
    // Validación básica en cliente
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
      contraseña: data.password,
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
        })
      );
  }

  /**
   * Login: llama a POST /api/auth/login
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    if (!this.isValidEmail(credentials.email)) {
      return throwError(() => new Error('Email inválido'));
    }

    if (!credentials.password) {
      return throwError(() => new Error('La contraseña es requerida'));
    }

    const payload = {
      email: credentials.email,
      contraseña: credentials.password,
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
      })
    );
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
