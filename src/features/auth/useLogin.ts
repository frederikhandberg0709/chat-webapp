import { useMutation } from "@tanstack/react-query";
import { loginUser } from "./api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export const useLogin = () => {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      login(response.accessToken, response.refreshToken, response.user);

      console.log("User logged in:", response);
      setTimeout(() => {
        router.push("/");
      }, 100);
    },
    onError: (error: AxiosError) => {
      console.error("Login failed:", error.response?.data || error.message);
    },
  });
};
