export interface RegisterDTO {
  dni: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  lastName: string;
  message: string;
  token?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
}
