import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email({
    message: "Must be a valid email format. Example: user@service.com",
  })
  .min(5, { message: "Email must be at least 5 characters long" })
  .max(320, { message: "Email must be at most 320 characters long" });

const usernameSchema = z
  .string()
  .trim()
  .min(5, { message: "Username must be at least 5 characters long" })
  .max(64, { message: "Username must be at most 64 characters long" });

const passwordSchema = z
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
  .regex(/^\S*$/, { message: "Password must not contain spaces" });

export const CreateUserSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});

export const UpdateUserSchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema.optional(),
  password: passwordSchema.optional(),
});

export const LoginUserSchema = z.object({
  username: z.string().trim().max(300),
  password: z.string().trim().max(300),
});

export const UpgradeUserSchema = z.object({
  accessTarget: z.string().trim().toUpperCase(),
  accessSecret: z.string().trim(),
});
