export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}
