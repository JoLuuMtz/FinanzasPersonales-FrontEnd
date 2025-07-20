import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  RegisterDTO,
  RegisterResponse,
} from '../interfaces/register.interface';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { env } from '../../../environment/envirotment.prod';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = env.BASE_URL;

  //login Property

  // private readon

  constructor() {
    console.log(this.baseUrl);
  }

  // Todo: Implementar el servicio de registros
  register(register: RegisterDTO): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.baseUrl}/register`, register)
      .pipe(
        timeout(10000), // Timeout de 10 segundos
        retry(2), // Reintentar 2 veces en caso de error
        // catchError(this.handleError.bind(this)),
        catchError((error) => this.handleError(error)) //manda el error al mejaddor de erorres
      );
  }

  /**
   * Maneja los errores HTTP de manera centralizada
   * @param error - Error HTTP recibido
   * @returns Observable con error formateado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // si viene de un error de red o cliente
      // Error del cliente o de red
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos';
          break;
        case 409:
          errorMessage = 'El usuario ya existe';
          break;
        case 422:
          errorMessage = 'Datos de registro inválidos';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        case 0:
          errorMessage = 'No se pudo conectar con el servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${
            error.error?.message || 'Error desconocido'
          }`;
      }
    }

    console.error('Error en AuthService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
