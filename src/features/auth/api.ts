import api from "@/lib/axios";
import { tokenStorage } from "@/lib/tokenStorage";
import { LoginInput, RegisterInput } from "@/schemas/user";
import { AuthResponse, User } from "@/types/user";

export const registerUser = async (input: RegisterInput): Promise<User> => {
  const res = await api.post<AuthResponse>("/auth/register", input);

  tokenStorage.setTokens(res.data.accessToken, res.data.refreshToken);

  return res.data.user;
};

export const loginUser = async (input: LoginInput): Promise<User> => {
  const res = await api.post<AuthResponse>("/auth/login", input);

  tokenStorage.setTokens(res.data.accessToken, res.data.refreshToken);

  return res.data.user;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    tokenStorage.clearTokens();
  }
};

export const currentUser = async (): Promise<User> => {
  const res = await api.get<User>("/users/me");
  return res.data;
};
