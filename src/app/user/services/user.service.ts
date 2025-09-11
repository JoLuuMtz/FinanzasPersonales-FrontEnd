import { AuthService } from './../../auth/services/auth.service';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../../auth/interfaces/user.interfaces';
import { Observable, tap } from 'rxjs';
import { env } from '../../../environment/environmet';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl: string = env.BASE_URL;
  private readonly _http = inject(HttpClient);
  private readonly _authService: AuthService = inject(AuthService);

  // public User: UserData = this._authService.getCurrentUser() as UserData;
  public User = computed(() => this._authService.currentUser() as UserData);
  // public User: Signal<UserData | null> = this._authService.currentUser;

  constructor() {}

  //TODO:Obtener Data del usuario por ID

  getUserById(id: number): Observable<UserData | null> {
    id = this.User()?.idUser || 0;
    return this._http.get<UserData>(`${this.baseUrl}/data/by/id?id=${id}`).pipe(
      tap((res: UserData) => {
        if (!res) {
          return;
        }
        console.log('Usuario obtenido:', res);
        this._authService.currentUser.set(res);
      })
    );
  }

  // TODO: Implementar Operaciones al servicio de usuarios... CRUD ETC



}
