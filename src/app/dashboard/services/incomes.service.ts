import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { env } from '../../../environment/environmet';
import { TypeIncome } from '../../auth/interfaces/user.interfaces';
import { catchError, Observable, of, tap } from 'rxjs';
import { IncomeDTO } from '../interfaces/Incomes.interface';

@Injectable({ providedIn: 'root' })
export class IncomesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = env.BASE_URL;

  constructor() {}

  //? Obteiene la data de tipos de Ingresos
  getIncomeType(): Observable<TypeIncome[] | undefined> {
    return this.http.get<TypeIncome[]>(`${this.baseUrl}/Incomes/types`).pipe(
      catchError(() => {
        return of(undefined);
      })
    );
  }

  //? Add Income
  addNewIncome(newIncome: IncomeDTO): Observable<IncomeDTO | null> {
    return this.http
      .post<IncomeDTO>(`${this.baseUrl}/Incomes/create`, newIncome)
      .pipe(
        tap({
          next: (income) => console.info('Ingreso agregado:', income),
          error: (error) => console.warn('Error al agregar ingreso:', error),
        }),
        catchError(() => of(null))
      );
  }

  //?=  Update Income
  UpdateIncome(
    incomeId: number,
    updatedIncome: IncomeDTO
  ): Observable<IncomeDTO | null> {
    return this.http
      .put<IncomeDTO>(
        `${this.baseUrl}/Incomes/update?id=${incomeId}`,
        updatedIncome
      )
      .pipe(
        tap({
          next: (income) => console.info('Ingreso actualizado:', income),
          error: (error) => console.warn('Error al actualizar ingreso:', error),
        }),
        catchError(() => of(null))
      );
  }

  //? Delete Income  by Id
  deleteIncomeByID(incomeId: number): Observable<boolean | null> {
    return this.http
      .delete<boolean>(`${this.baseUrl}/Incomes/delete?id=${incomeId}`)
      .pipe(
        tap({
          next: () => {
            console.info('Ingreso eliminado');
            return true;
          },
          error: (error) => console.warn('Error al eliminar ingreso:', error),
        }),
        catchError(() => of(null))
      );
  }
}
