
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { env } from '../../../environment/envirotment.prod';

@Injectable({ providedIn: 'root' })
export class UserAlreadyExistValidator {
  private readonly baseUrl = env.BASE_URL;
  private readonly http: HttpClient = inject(HttpClient);

  /**
   * Validador asíncrono que verifica si un email ya existe en la base de datos
   * @returns AsyncValidatorFn que retorna Observable<ValidationErrors | null>
   */
  userAlreadyExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;

      // Si no hay email, no hay error
      if (!email || !this.isValidEmail(email)) {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(500), // Espera 500ms después del último cambio
        distinctUntilChanged(), // Solo procede si el valor cambió
        switchMap(() => this.checkEmailExists(email))
      );
    };
  }

  /**
   * Función estática para usar directamente en el FormBuilder
   * @param validatorInstance - Instancia del validador
   * @returns AsyncValidatorFn
   */
  static createValidator(validatorInstance: UserAlreadyExistValidator): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;

      if (!email || !validatorInstance.isValidEmail(email)) {
        return of(null);
      }

      return of(email).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(() => validatorInstance.checkEmailExists(email))
      );
    };
  }

  /**
   * Realiza la petición HTTP para verificar si el email existe
   * @param email - Email a verificar
   * @returns Observable<ValidationErrors | null>
   */
  private checkEmailExists(email: string): Observable<ValidationErrors | null> {
    return this.http.get(`${this.baseUrl}/users/getbyemail/${email}`).pipe(
      map((response: any) => {
        // Si la API retorna datos, significa que el usuario existe
        if (response && (response.email || response.id)) {
          return { userAlreadyExists: { email, message: 'Este email ya está registrado' } };
        }
        return null; // Email disponible
      }),
      catchError((error) => {
        // Si es un 404, significa que el usuario no existe (email disponible)
        if (error.status === 404) {
          return of(null);
        }
        
        // Para otros errores, no bloquear el formulario
        console.warn('Error al verificar email:', error);
        return of(null);
      })
    );
  }

  /**
   * Valida el formato básico del email
   * @param email - Email a validar
   * @returns boolean
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}