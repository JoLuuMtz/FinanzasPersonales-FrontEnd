import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { env } from '../../../environment/environmet';
import { TypeIncome } from '../../auth/interfaces/user.interfaces';
import { catchError, Observable, of, take, tap } from 'rxjs';
import { IncomeDTO, IncomeUpdateDTO } from '../interfaces/Incomes.interface';
import { UserService } from '../../user/services/user.service';

@Injectable({ providedIn: 'root' })
export class IncomesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = env.BASE_URL;
  private readonly _userService = inject(UserService);

  constructor() {}

  //? Obteiene la data de tipos de Ingresos
  getIncomeType(): Observable<TypeIncome[] | null> {
    return this.http.get<TypeIncome[]>(`${this.baseUrl}/Incomes/types`).pipe(
      tap({
        next: (data) => console.info('Tipos de ingreso obtenidos:', data),
        error: (error) =>
          console.warn('Error al obtener tipos de ingreso:', error),
      }),
      catchError(() => of(null))
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
        tap(() => {
          this._userService.refreshCurrentUserData();
        }),
        catchError(() => of(null))
      );
  }

  //?=  Update Income
  UpdateIncome(
    incomeId: number,
    updatedIncome: IncomeUpdateDTO
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
            this._userService.refreshCurrentUserData();
          },
          error: (error) => console.warn('Error al eliminar ingreso:', error),
        }),
        catchError(() => of(null))
      );
  }
}
