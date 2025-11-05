import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../models/user.model';

/**
 * Servicio de autenticación mock.
 * TODO: Reemplazar con llamadas reales a backend API cuando esté disponible.
 *
 * Este servicio simula:
 * - Registro de usuarios (almacena en memoria)
 * - Login con validación de credenciales
 * - Gestión de sesión con localStorage
 * - Estado de autenticación reactivo
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'genai_auth_token';
  private readonly USER_KEY = 'genai_user';

  // Estado reactivo del usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Simulación de base de datos en memoria
  private mockUsers: Array<{ email: string; password: string; name: string }> = [
    { email: 'admin@genai.com', password: 'admin123', name: 'Administrador' }
  ];

  constructor() {}

  /**
   * Obtiene el usuario actual del almacenamiento
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Registra un nuevo usuario
   * TODO: Conectar con endpoint POST /api/auth/register
   */
  register(data: RegisterData): Observable<AuthResponse> {
    // Validación básica
    if (!this.isValidEmail(data.email)) {
      return throwError(() => new Error('Email inválido'));
    }

    if (data.password.length < 6) {
      return throwError(() => new Error('La contraseña debe tener al menos 6 caracteres'));
    }

    if (data.password !== data.confirmPassword) {
      return throwError(() => new Error('Las contraseñas no coinciden'));
    }

    // Verificar si el usuario ya existe
    const userExists = this.mockUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (userExists) {
      return throwError(() => new Error('Este email ya está registrado'));
    }

    // Agregar usuario a la base de datos mock
    this.mockUsers.push({
      email: data.email,
      password: data.password,
      name: data.name
    });

    // Crear usuario y token
    const user: User = {
      id: this.generateId(),
      name: data.name,
      email: data.email
    };

    const token = this.generateToken();
    const response: AuthResponse = { user, token };

    // Simular delay de red
    return of(response).pipe(
      delay(800),
      tap((res) => {
        this.saveAuthData(res.user, res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }

  /**
   * Inicia sesión con credenciales
   * TODO: Conectar con endpoint POST /api/auth/login
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Validación básica
    if (!this.isValidEmail(credentials.email)) {
      return throwError(() => new Error('Email inválido'));
    }

    if (!credentials.password) {
      return throwError(() => new Error('La contraseña es requerida'));
    }

    // Buscar usuario en la base de datos mock
    const mockUser = this.mockUsers.find(
      u => u.email.toLowerCase() === credentials.email.toLowerCase() &&
           u.password === credentials.password
    );

    if (!mockUser) {
      return throwError(() => new Error('Credenciales inválidas')).pipe(delay(800));
    }

    // Simular delay de red y login exitoso
    const user: User = {
      id: this.generateId(),
      name: mockUser.name,
      email: mockUser.email
    };

    const token = this.generateToken();
    const response: AuthResponse = { user, token };

    return of(response).pipe(
      delay(800),
      tap((res) => {
        this.saveAuthData(res.user, res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }

  /**
   * Cierra la sesión del usuario
   * TODO: Conectar con endpoint POST /api/auth/logout si es necesario
   */
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Guarda los datos de autenticación
   */
  private saveAuthData(user: User, token: string): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.STORAGE_KEY, token);
  }

  /**
   * Genera un ID único (mock)
   */
  private generateId(): string {
    return 'user_' + Math.random().toString(36).substring(2, 9);
  }

  /**
   * Genera un token único (mock)
   */
  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Valida formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
