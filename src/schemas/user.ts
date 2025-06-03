import { z } from "zod";

export const RegisterInputSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  password: z.string().min(8).max(100),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const LoginInputSchema = z.object({
  usernameOrEmail: z.string().nonempty(),
  password: z.string().nonempty(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
