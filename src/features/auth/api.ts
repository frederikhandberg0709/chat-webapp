import api from "@/lib/axios";
import { LoginInput, RegisterInput } from "@/schemas/user";
import { AuthResponse } from "@/types/auth";

export const registerUser = async (
  input: RegisterInput,
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/register", input);
  return res.data;
};

export const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", input);
  return res.data;
};

// export const logoutUser = async (): Promise<void> => {
//   try {
//     await api.post("/auth/logout");
//   } finally {
//     tokenStorage.clearTokens();
//   }
// };
