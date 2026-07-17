import { z } from 'zod'

export const LoginSchema = z.object({
    email : z.string().email("Invalid email address"),
    password : z.string().min(8, "Password must be at least 8 characters long"),
})

export const RegisterSchema = z.object({
    name : z.string().min(2, "Name must be at least 2 characters long"),
    email : z.string().email("Invalid email address"),
    password : z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword : z.string().min(8, "Confirm Password must be at least 8 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords and Confirm Password must match",
    path: ["confirmPassword"],
})