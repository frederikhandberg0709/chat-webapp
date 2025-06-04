import { z } from "zod";

export const RegisterInputSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(50, "Username cannot exceed 20 characters"),
  // TODO: Add in the future:
  // .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email(),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  // TODO: Add in the future:
  // .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),
  // TODO: Add in the future:
  // .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password cannot exceed 100 characters"),
  // TODO: Add in the future:
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  // "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const LoginInputSchema = z.object({
  usernameOrEmail: z.string().nonempty(),
  password: z.string().nonempty(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
