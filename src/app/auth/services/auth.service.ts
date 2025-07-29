import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  RegisterDTO,
  RegisterResponse,
} from '../interfaces/register.interface';
import {
  LoginDTO,
  LoginResponse,
} from '../interfaces/login-response.interfaces';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, timeout } from 'rxjs/operators';
import { env } from '../../../environment/environmet';
import { ErrorHandlerService } from '../../shared/services/handle-error.service';
import { UserData } from '../interfaces/user.interfaces';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly handleError = inject(ErrorHandlerService);
  private readonly baseUrl: string = env.BASE_URL;

  private currentUser = signal<UserData | null>(null);
  public IsAutenticated = signal<boolean>(false);
  public userToken = signal<string | null>(null);

  public userAuthenticatedStatus = signal<'authenticated' | 'unauthenticated'>(
    'unauthenticated'
  );

  public getCurrentUser = computed(() => {
    return this.currentUser();
  });

  constructor() {
    // console.log(this.baseUrl);
    // // manejador de estado de la Autenticacion
    // const token = localStorage.getItem('accessToken');
    // if (!token) {
    //   this.IsAutenticated.set(false);
    //   this.userAuthenticatedStatus.set('unauthenticated');
    //   this.currentUser.set(null);
    //   return;
    // }
    // effect(() => {
    //   const user = this.getCurrentUser();
    //   if (user && token) { // si hay data y token
    //     console.log('Usuario autenticado:', user);
    //   } else {
    //     console.log('No hay usuario autenticado');
    //   }
    // });
  }

  // Todo: Implementar el servicio de registros
  register(register: RegisterDTO): Observable<RegisterDTO> {
    return this.http
      .post<RegisterDTO>(`${this.baseUrl}/user/register`, register)
      .pipe(
        timeout(10000), // Timeout de 10 segundos (si no hay respuesta en este tiempo, se lanzará un error)
        retry(2), // Reintentar 2 veces en caso de error
        // catchError(this.handleError.bind(this)),
        catchError((error) => this.handleError.handleError(error)) //manda el error al mejaddor de erorres
      );
  }

  login(login: LoginDTO): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/user/login`, login)
      .pipe(
        tap((response: LoginResponse) => {
          this.currentUser.set(response.User); // Actualiza la data del usuario actual
          this.IsAutenticated.set(true); // Actualiza el estado de autenticación
          this.userAuthenticatedStatus.set('authenticated'); // Actualiza el estado de autenticación
          localStorage.setItem('accessToken', response.accessToken); // Guarda el token en localStorage
          this.userToken.set(response.accessToken); // Guarda el token en el estado
        }),
        timeout(10000), // Timeout de 10 segundos
        retry(2), // Reintentar 2 veces en caso de error
        catchError((error: HttpErrorResponse) =>
          this.handleError.handleError(error)
        ) // Manejo de errores
      );
  }

  logOut(): void {
    this.currentUser.set(null);
    this.IsAutenticated.set(false);
    this.userAuthenticatedStatus.set('unauthenticated');
    this.userToken.set(null);
    localStorage.removeItem('accessToken');
  }

  // ================================
  // MÉTODOS CENTRALIZADOS DE VALIDACIÓN DE FORMULARIOS
  // ================================

  /**
   * Verifica si un campo del formulario es inválido y ha sido tocado
   * @param form - FormGroup del formulario
   * @param fieldName - Nombre del campo a validar
   * @returns true si el campo es inválido y ha sido tocado
   */
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  /**
   * Verifica si hay errores de servidor en un campo específico
   * @param form - FormGroup del formulario
   * @param fieldName - Nombre del campo a verificar
   * @returns true si hay errores de servidor
   */
  hasServerErrors(form: FormGroup, fieldName: string): boolean {
    const control = form.get(fieldName);
    return !!control?.errors?.['serverError'];
  }

  /**
   * Obtiene el mensaje de error del servidor si existe
   * @param form - FormGroup del formulario
   * @param fieldName - Nombre del campo
   * @returns string con el mensaje de error o null
   */
  getServerErrorMessage(form: FormGroup, fieldName: string): string | null {
    const control = form.get(fieldName);
    return control?.errors?.['serverError'] || null;
  }

  /**
   * Obtiene el mensaje de error apropiado para un campo del formulario
   * @param form - FormGroup del formulario
   * @param fieldName - Nombre del campo
   * @returns string con el mensaje de error o null
   */
  getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors;
    if (!errors) return null;

    // Obtener el primer error y devolver el mensaje apropiado
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres`;

        case 'maxlength':
          return `No puede tener más de ${errors['maxlength'].requiredLength} caracteres`;

        case 'email':
          return 'El formato del email es incorrecto';

        case 'passwordNotMatch':
          return 'Las contraseñas no coinciden';

        case 'invalidEmail':
          return 'El correo no es correcto';

        case 'pattern':
          return 'La contraseña debe contener al menos 8 caracteres, una mayúscula y un carácter especial.';

        case 'userAlreadyExists':
          return 'Email ya registrado!';

        case 'serverError':
          return errors['serverError'] || 'Error de conexión con el servidor';

        case 'userNotFound':
          return 'Usuario no encontrado';

        case 'invalidCredentials':
          return 'Credenciales inválidas';

        default:
          return 'Campo inválido';
      }
    }

    return null;
  }

  /**
   * Verifica si hay errores de servidor en cualquier campo del formulario
   * @param form - FormGroup del formulario
   * @returns true si hay errores de servidor en algún campo
   */
  hasAnyServerErrors(form: FormGroup): boolean {
    const controls = Object.keys(form.controls);
    return controls.some(
      (controlName) => form.get(controlName)?.errors?.['serverError']
    );
  }

  /**
   * Obtiene todos los mensajes de error de servidor del formulario
   * @param form - FormGroup del formulario
   * @returns array de strings con los mensajes de error
   */
  getAllServerErrorMessages(form: FormGroup): string[] {
    const controls = Object.keys(form.controls);
    const serverErrors: string[] = [];

    controls.forEach((controlName) => {
      const error = form.get(controlName)?.errors?.['serverError'];
      if (error) {
        serverErrors.push(error);
      }
    });

    return serverErrors;
  }
}
