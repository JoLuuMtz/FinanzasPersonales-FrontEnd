import { AuthService } from './../../auth/services/auth.service';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../../auth/interfaces/user.interfaces';


@Injectable({providedIn: 'root'})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly _authService: AuthService = inject(AuthService);

  public User : UserData  = this._authService.getCurrentUser() as UserData;



  // Todo: Implementar Operaciones al servicio de usuarios... CRUD ETC






}
