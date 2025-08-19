import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  RegisterDTO,
  RegisterResponse,
} from '../interfaces/register.interface';
import {
  LoginDTO,
  LoginResponse,
} from '../interfaces/login-response.interfaces';
import {
  RefreshTokenResponse,
  RefreshTokenDTO,
} from '../interfaces/refresh-token.interface';
import { Observable, throwError, interval, Subscription } from 'rxjs';
import { catchError, retry, tap, timeout } from 'rxjs/operators';
import { env } from '../../../environment/environmet';
import { ErrorHandlerService } from '../../shared/services/handle-error.service';
import { UserData } from '../interfaces/user.interfaces';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly handleError = inject(ErrorHandlerService); //? manejo de errores de la API
  private readonly baseUrl: string = env.BASE_URL;

  // Propiedades para monitoreo automático
  private refreshSubscription?: Subscription;
  private readonly CHECK_INTERVAL = 60000; // 1 minuto
  private readonly REFRESH_THRESHOLD = 5; // 5 minutos antes de expirar

  // Signals
  private currentUser = signal<UserData | null>(null);
  public IsAutenticated = signal<boolean>(false);
  public userToken = signal<string | null>(null);
  public refreshToken = signal<string | null>(null);
  public userAuthenticatedStatus = signal<'authenticated' | 'unauthenticated'>(
    'unauthenticated'
  );

  // Computed
  public getCurrentUser = computed(() => this.currentUser());

  constructor() {
    this.initializeAuthState();
    this.setupAuthEffect();
  }

  // ================================
  // INICIALIZACIÓN Y ESTADO
  // ================================

  private initializeAuthState(): void {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userData = localStorage.getItem('User');

    if (token && userData) {
      try {
        const user: UserData = JSON.parse(userData);
        this.setAuthState(token, refreshToken, user);

      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        this.clearAuthState();
      }
    } else {
      this.clearAuthState();
    }
  }

  private setupAuthEffect(): void {
    effect(() => {
      const user = this.getCurrentUser();
      const token = this.userToken();
      const isAuthenticated = !!(user && token);

      this.IsAutenticated.set(isAuthenticated);
      this.userAuthenticatedStatus.set(
        isAuthenticated ? 'authenticated' : 'unauthenticated'
      );


    });
  }

  private setAuthState(
    token: string,
    refreshToken: string | null,
    user: UserData
  ): void {
    this.userToken.set(token);
    this.refreshToken.set(refreshToken);
    this.currentUser.set(user);
    this.IsAutenticated.set(true);
    this.userAuthenticatedStatus.set('authenticated');
  }

  private clearAuthState(): void {
    this.currentUser.set(null);
    this.IsAutenticated.set(false);
    this.userAuthenticatedStatus.set('unauthenticated');
    this.userToken.set(null);
    this.refreshToken.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('User');
  }

  // ================================
  // MÉTODOS DE AUTENTICACIÓN
  // ================================

  register(register: RegisterDTO): Observable<RegisterDTO> {
    return this.http
      .post<RegisterDTO>(`${this.baseUrl}/user/register`, register)
      .pipe(
        timeout(10000),
        retry(2),
        catchError((error) => this.handleError.handleError(error))
      );
  }

  login(login: LoginDTO): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/user/login`, login)
      .pipe(
        tap((response: any) => {
          const user: UserData = response.user;
          this.setAuthState(response.accessToken, response.refreshToken, user);
          this.saveToLocalStorage(
            response.accessToken,
            response.refreshToken,
            user
          );
          this.restartTokenRefreshMonitoring();
          this.logAuthInfo();
        }),
        timeout(10000),
        retry(2),
        catchError((error) => this.handleError.handleError(error))
      );
  }

  logOut(): void {
    this.clearAuthState();
    this.stopTokenRefreshMonitoring();

  }

  // ================================
  // MÉTODOS DE TOKEN
  // ================================

  refreshAccessToken(): Observable<RefreshTokenResponse> {
    const currentRefreshToken = this.refreshToken();
    if (!currentRefreshToken) {
      return throwError(() => new Error('No hay refresh token disponible'));
    }

    return this.http
      .post<RefreshTokenResponse>(`${this.baseUrl}/user/refresh-token`, {
        refreshToken: currentRefreshToken,
      })
      .pipe(
        tap((response) => {
          this.updateTokens(response.accessToken, response.refreshToken);

        }),
        timeout(10000),
        retry(1),
        catchError((error) => {
          console.error('Error al refrescar token:', error);
          this.logOut();
          return this.handleError.handleError(error);
        })
      );
  }

  updateTokens(accessToken: string, refreshToken: string): void {
    this.userToken.set(accessToken);
    this.refreshToken.set(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  isTokenExpiringSoon(): boolean {
    const token = this.userToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      return expirationTime - currentTime < fiveMinutes;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return false;
    }
  }

  getTokenTimeRemaining(): number | null {
    const token = this.userToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeRemaining = Math.floor(
        (expirationTime - currentTime) / (1000 * 60)
      );
      return timeRemaining > 0 ? timeRemaining : 0;
    } catch (error) {
      console.error('Error al obtener tiempo restante del token:', error);
      return null;
    }
  }

  // ================================
  // MONITOREO AUTOMÁTICO
  // ================================

  private startTokenRefreshMonitoring(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    this.refreshSubscription = interval(this.CHECK_INTERVAL).subscribe(() =>
      this.checkAndRefreshToken()
    );
  }

  private checkAndRefreshToken(): void {
    if (!this.IsAutenticated()) return;

    const timeRemaining = this.getTokenTimeRemaining();
    if (timeRemaining !== null && timeRemaining <= this.REFRESH_THRESHOLD) {
      console.log(`Token expira en ${timeRemaining} minutos. Refrescando...`);
      this.refreshTokenAutomatically();
    }
  }

  private refreshTokenAutomatically(): void {
    this.refreshAccessToken().subscribe({
      next: () => console.log('Token refrescado automáticamente'),
      error: () => this.logOut(),
    });
  }

  public stopTokenRefreshMonitoring(): void {
    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = undefined;
  }

  public restartTokenRefreshMonitoring(): void {
    this.startTokenRefreshMonitoring();
  }

  public getTokenInfo() {
    return {
      isAuthenticated: this.IsAutenticated(),
      timeRemaining: this.getTokenTimeRemaining(),
      isExpiringSoon: this.isTokenExpiringSoon(),
    };
  }

  // ================================
  // MÉTODOS DE VALIDACIÓN DE FORMULARIOS
  // ================================

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  hasServerErrors(form: FormGroup, fieldName: string): boolean {
    return !!form.get(fieldName)?.errors?.['serverError'];
  }

  getServerErrorMessage(form: FormGroup, fieldName: string): string | null {
    return form.get(fieldName)?.errors?.['serverError'] || null;
  }

  getFieldError(form: FormGroup, fieldName: string): string | null {
    const errors = form.controls[fieldName]?.errors;
    if (!errors) return null;

    const errorMessages: Record<string, string> = {
      required: 'Este campo es requerido',
      email: 'El formato del email es incorrecto',
      passwordNotMatch: 'Las contraseñas no coinciden',
      invalidEmail: 'El correo no es correcto',
      userAlreadyExists: 'Email ya registrado!',
      userNotFound: 'Usuario no encontrado',
      invalidCredentials: 'Credenciales inválidas',
      pattern:
        'La contraseña debe contener al menos 8 caracteres, una mayúscula y un carácter especial.',
      serverError: errors['serverError'] || 'Error de conexión con el servidor',
    };

    for (const key of Object.keys(errors)) {
      if (errorMessages[key]) return errorMessages[key];

      if (key === 'minlength') {
        return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
      }
      if (key === 'maxlength') {
        return `No puede tener más de ${errors['maxlength'].requiredLength} caracteres`;
      }
    }

    return 'Campo inválido';
  }

  hasAnyServerErrors(form: FormGroup): boolean {
    return Object.keys(form.controls).some(
      (controlName) => form.get(controlName)?.errors?.['serverError']
    );
  }

  getAllServerErrorMessages(form: FormGroup): string[] {
    return Object.keys(form.controls)
      .map((controlName) => form.get(controlName)?.errors?.['serverError'])
      .filter((error) => error) as string[];
  }

  // ================================
  // MÉTODOS PRIVADOS DE UTILIDAD
  // ================================

  private saveToLocalStorage(
    accessToken: string,
    refreshToken: string,
    user: UserData
  ): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('User', JSON.stringify(user));
  }

  private logAuthInfo(): void {
    console.log(`Usuario autenticado: ${this.getCurrentUser()}`);
    console.log(
      `Estado: ${this.userAuthenticatedStatus()}, Token: ${this.userToken()}, Autenticado: ${this.IsAutenticated()}`
    );
  }
}
