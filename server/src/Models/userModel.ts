import { z } from "zod";

export const SignUpSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name can't be longer than 100 characters"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    image: z.string().optional(),
});

export const SignInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string(),
});
