import { ComponentFactoryResolver, inject, Injectable } from '@angular/core';
import { env } from '../../../environment/environmet';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../user/services/user.service';
import {
  BudgetDTO,
  CreateBudgetDTO,
  UpdateBudgetDTO,
} from '../interfaces/budget.interface';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly baseUrl = env.BASE_URL;
  private readonly http = inject(HttpClient);
  private readonly _userService = inject(UserService);

  constructor() {}



  //? CREATE
  addNewBudget(newBudget: CreateBudgetDTO): Observable<BudgetDTO | null> {
    return this.http
      .post<BudgetDTO>(`${this.baseUrl}/budget/create`, newBudget)
      .pipe(
        tap(() => {
          console.log('creacion de un nuevo backend');
          this._userService.refreshCurrentUserData(); // ejecuta un efecto secundario
        }),
        catchError(() => of(null))
      );
  }
  //? DELETE

  deleteBudget(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/budget/delete?id=${id}`).pipe(
      tap(() => {
        console.log('borrado de un nuevo backend');
        this._userService.refreshCurrentUserData(); // ejecuta un efecto secundario
      }),
      catchError(() => of(false))
    );
  }

  //? Update
  updateBudget(
    id: number,
    updatedBudget: UpdateBudgetDTO
  ): Observable<BudgetDTO | null> {
    return this.http
      .put<BudgetDTO>(`${this.baseUrl}/budget/update?id=${id}`, updatedBudget)
      .pipe(
        tap(() => {
          console.log('actualizacion de un nuevo backend');
          this._userService.refreshCurrentUserData(); // ejecuta un efecto secundario
        }),
        catchError(() => of(null))
      );
  }

  //TODO: CREAR CRUD BUDGET CATEGORY
}
