import { z, ZodType } from 'zod';

export class TripValidation {
  static readonly CREATE: ZodType = z
    .object({
      name: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      location: z.string().min(1).max(100),
      start_date: z.string().datetime(),
      end_date: z.string().datetime(),
    })
    .refine((data) => {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end > start;
    });

  static readonly UPDATE: ZodType = z
    .object({
      name: z.string().min(1).max(100).optional(),
      description: z.string().max(500).optional(),
      location: z.string().min(1).max(100).optional(),
      start_date: z.string().datetime().optional(),
      end_date: z.string().datetime().optional(),
    })
    .refine((data) => {
      if (data.start_date && data.end_date) {
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        return end > start;
      }
      return true; // Skip jika hanya salah satu yang diupdate
    });
}
