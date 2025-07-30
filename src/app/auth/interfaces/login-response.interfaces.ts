import { UserData } from './user.interfaces';

export interface LoginResponse {
  success: boolean; // indica si el inicio de sesión fue exitoso
  message: string; // mensaje de respuesta
  accessToken: string; // JWT token
  user: UserData;
}

export interface LoginDTO {
  email: string; // correo electrónico del usuario
  password: string; // contraseña del usuario
}
