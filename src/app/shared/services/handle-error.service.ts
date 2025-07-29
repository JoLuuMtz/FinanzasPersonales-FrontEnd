// src/app/core/services/error-handler.service.ts

import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// matiene los errores de las  peticiones http cuando se hacen soliocitudes al servidor
export class ErrorHandlerService {

  /**
   * Maneja los errores HTTP de manera centralizada
   * @param error - Error HTTP recibido
   * @returns Observable con error formateado
   */
  
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    // verifica si el error es del cliente o del servidor
    if (error.error instanceof ErrorEvent) {
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
          errorMessage = `Error ${error.status}: ${error.error?.message || 'Error desconocido'}`;
      }
    }

    console.error('Error HTTP capturado:', error);
    return throwError(() => new Error(errorMessage));
  }
}
