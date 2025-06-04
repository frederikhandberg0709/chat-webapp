import { LoginInput } from "@/schemas/user";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "./api";
import { AxiosError } from "axios";

export const useLogin = () => {
  return useMutation({
    mutationFn: (input: LoginInput) => loginUser(input),
    onSuccess: (data) => {
      // TODO: set auth state, redirect
      console.log("User logged in:", data);
    },
    onError: (error: AxiosError) => {
      // TODO: handle error. show error message
      console.error("Login failed:", error.response?.data || error.message);
    },
  });
};
