import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { env } from '../../../environment/environmet';
import { TypeIncome } from '../../auth/interfaces/user.interfaces';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IncomesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = env.BASE_URL;


  constructor() {}

  //? Obteiene la data de
  getIncomeType(): Observable<TypeIncome[] | undefined> {
    return this.http.get<TypeIncome[]>(`${this.baseUrl}/Incomes/types`).pipe(
      tap((data: TypeIncome[]) => {
        console.log('data cargada', data);
      }),
      catchError(() => {
        return of(undefined);
      })
    );
  }


  //todo: Obtener Listado de Tipos de Ingresos
}
