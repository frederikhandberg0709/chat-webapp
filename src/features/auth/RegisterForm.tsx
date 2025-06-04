"use client";

import { RegisterInput, RegisterInputSchema } from "@/schemas/user";
import { useRegister } from "./useRegister";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterInputSchema),
  });

  const { mutate: registerUser, isPending, error } = useRegister();

  const onSubmit = (data: RegisterInput) => {
    registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
      <input {...register("username")} placeholder="Username" />
      {errors.username && <p>{errors.username.message}</p>}

      <input {...register("email")} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register("firstName")} placeholder="First name" />
      {errors.firstName && <p>{errors.firstName.message}</p>}

      <input {...register("lastName")} placeholder="Last name" />
      {errors.lastName && <p>{errors.lastName.message}</p>}

      <input type="password" {...register("password")} placeholder="Password" />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? "Registering..." : "Register"}
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
