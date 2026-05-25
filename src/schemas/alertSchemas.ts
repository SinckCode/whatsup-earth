import { z } from 'zod';

export const createAlertSchema = z.object({
  categorySlug: z
    .string('Categoría es requerida')
    .min(1, 'Categoría es requerida'),
  regions: z
    .array(z.string())
    .min(1, 'Debes seleccionar al menos una región')
    .optional()
    .default([]),
  countries: z
    .array(z.string())
    .optional()
    .default([]),
  severityMin: z
    .number()
    .min(0, 'La severidad mínima debe ser >= 0')
    .max(100, 'La severidad mínima debe ser <= 100')
    .default(0)
    .optional(),
  notifyByEmail: z
    .boolean()
    .default(true)
    .optional(),
});

export const updateAlertSchema = z.object({
  categorySlug: z.string().optional(),
  regions: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(),
  severityMin: z
    .number()
    .min(0, 'La severidad mínima debe ser >= 0')
    .max(100, 'La severidad mínima debe ser <= 100')
    .optional(),
  notifyByEmail: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
