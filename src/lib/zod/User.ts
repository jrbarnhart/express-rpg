import { z } from "zod";

export const NewUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email({
      message: "Must be a valid email format. Example: user@service.com",
    })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(320, { message: "Email must be at most 320 characters long" }),
  username: z
    .string()
    .trim()
    .min(5, { message: "Username must be at least 5 characters long" })
    .max(64, { message: "Username must be at most 64 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/^\S*$/, { message: "Password must not contain spaces" }),
});

export const UpdateUserSchema = z.object({
  id: z.number().int().positive(),
  email: z
    .string()
    .trim()
    .email({
      message: "Must be a valid email format. Example: user@service.com",
    })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(320, { message: "Email must be at most 320 characters long" })
    .optional(),
  username: z
    .string()
    .trim()
    .min(5, { message: "Username must be at least 5 characters long" })
    .max(64, { message: "Username must be at most 64 characters long" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/^\S*$/, { message: "Password must not contain spaces" })
    .optional(),
});
