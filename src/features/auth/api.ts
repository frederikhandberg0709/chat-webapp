import api from "@/lib/axios";
import { LoginInput, RegisterInput } from "@/schemas/user";
import { User } from "@/types/user";

export const registerUser = async (input: RegisterInput): Promise<User> => {
  const res = await api.post<User>("/auth/register", input);
  return res.data;
};

export const loginUser = async (input: LoginInput): Promise<User> => {
  const res = await api.post<User>("/auth/login", input);
  return res.data;
};
