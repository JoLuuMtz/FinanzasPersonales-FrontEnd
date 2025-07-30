import { AuthService } from './../../auth/services/auth.service';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRoutes } from '../../auth/auth.route';

@Injectable({providedIn: 'root'})
export class ServiceNameService {
  private readonly _http = inject(HttpClient);
  private readonly _authService: AuthService = inject(AuthService);



  // Todo: Implementar Operaciones al servicio de usuarios... CRUD ETC






}
