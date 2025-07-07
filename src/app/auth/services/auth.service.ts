import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterDTO } from '../interfaces/register.interface';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor() { }

  private readonly http : HttpClient = inject(HttpClient);



//Todo: Implementar el servicio de registros 
  // public register(register: RegisterDTO): Observable<RegisterDTO> {
    // return this.http.post<RegisterDTO>('http://localhost:3000/api/user/register', register);
  // }


}
