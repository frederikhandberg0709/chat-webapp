import { RegisterInput } from "@/schemas/user";
import { AxiosError } from "axios";
import { registerUser } from "./api";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationFn: (input: RegisterInput) => registerUser(input),
    onSuccess: (data) => {
      // TODO: handle success. redirect, toast
      console.log("User registered:", data);
    },
    onError: (error: AxiosError) => {
      // TODO: handle error. show error message
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
    },
  });
};
