import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z
    .object({
      username: z.string().min(3).max(30),
      name: z.string().min(1).max(100),
      email: z.string().email(),
      phone: z.string().min(10).max(15),
      password: z.string().min(6).max(100),
      confirmPassword: z.string().min(6).max(100),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(3).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    username: z.string().min(3).max(30).optional(),
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
  });
}
