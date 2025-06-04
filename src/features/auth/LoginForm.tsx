import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, LoginInputSchema } from "@/schemas/user";
import { useLogin } from "@/features/auth/useLogin";
import { AxiosError } from "axios";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginInputSchema),
  });

  const { mutate: loginUser, isPending, error } = useLogin();

  const onSubmit = (data: LoginInput) => {
    loginUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("usernameOrEmail")} placeholder="Username or Email" />
      {errors.usernameOrEmail && <p>{errors.usernameOrEmail.message}</p>}
      <input type="password" {...register("password")} placeholder="Password" />
      {errors.password && <p>{errors.password.message}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>

      {error && (
        <p className="text-red-500">
          {(error as AxiosError<{ message: string }>).response?.data.message ??
            "Something went wrong"}
        </p>
      )}
    </form>
  );
};
