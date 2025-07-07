import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserAlreadyExistValidator {
  private readonly http: HttpClient = inject(HttpClient);



}
