import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { env } from '../../../environment/environmet';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';


@Injectable({ providedIn: 'root' })
export class UserAlreadyExistService implements AsyncValidator {
  // constructor(private readonly http:  HttpClient) {}
  private readonly baseUrl = env.BASE_URL;
  private readonly sweetalert = Swal;
  private readonly http = inject(HttpClient);

  constructor() {
    console.log('HttpClient en constructor:', this.http); // Debug
  }

  validate = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    const email = control.value;
    if (!email) {
      return of(null); // Si el campo está vacío, no hay error
    }

    return this.http.get(`${this.baseUrl}/User/GetByEmail/${email}`).pipe(
      map((resp: any) => {
        // tipas la respuesta
        console.log(resp);
        if (resp.email === email) {
          // Verifica si el email existe
          // si hay usuarios retorna el error porque ya hay un usuario con ese email
          return { userAlreadyExists: true }; // Si el usuario ya existe, retorna un error
        }
        return null; // ← Cambié esto: quita el of(null) dentro del map
      }),
      catchError((error) => {
        if (error.status === 404) {
          // si no hay email retorna null
          console.log(' Email permitido ');
          return of(null);
        }
        if (error.status === 0 || error.status === 500) {

          this.sweetalert.fire({
            title: 'Error de conexión',
            text: 'No se puede verificar si el email existe,  por un error de conexión',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',

          });

          return of({ serverError: 'Error de conexión, No se puede verificar si el email existe' }); // Si hay un error de conexión, retorna un error genérico

        }

        return of({ serverError: 'Error al verificar el email' }); // Si hay un error, retorna un error genérico
      })
    );
  };
  // registerOnValidatorChange?(fn: () => void): void {
  //   throw new Error('Method not implemented.');
  // }
}
