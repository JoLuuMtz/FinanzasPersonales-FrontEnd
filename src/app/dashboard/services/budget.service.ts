import { inject, Injectable } from '@angular/core';
import { env } from '../../../environment/environmet';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../user/services/user.service';

@Injectable({ providedIn: 'root' })
export class BudgetService {

  private readonly  baseUrl = env.BASE_URL;
  private readonly http = inject(HttpClient);
  private readonly _userService = inject(UserService);
  
  constructor() {}

  //TODO: CREAR CRUD DE BUDGET
  


  //TODO: CREAR CRUD BUDGET CATEGORY

  
}
