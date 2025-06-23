export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}
