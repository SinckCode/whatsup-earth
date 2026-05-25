import { z } from 'zod';

export const createRegionSchema = z.object({
  name: z
    .string('Nombre es requerido')
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo'),
  minLat: z
    .number()
    .min(-90, 'Latitud mínima debe ser >= -90')
    .max(90, 'Latitud mínima debe ser <= 90'),
  maxLat: z
    .number()
    .min(-90, 'Latitud máxima debe ser >= -90')
    .max(90, 'Latitud máxima debe ser <= 90'),
  minLon: z
    .number()
    .min(-180, 'Longitud mínima debe ser >= -180')
    .max(180, 'Longitud mínima debe ser <= 180'),
  maxLon: z
    .number()
    .min(-180, 'Longitud máxima debe ser >= -180')
    .max(180, 'Longitud máxima debe ser <= 180'),
  isDefault: z.boolean().default(false).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color debe ser hexadecimal válido (ej: #FF0000)')
    .optional(),
}).refine((data) => data.maxLat >= data.minLat, {
  message: 'Latitud máxima debe ser >= latitud mínima',
  path: ['maxLat'],
}).refine((data) => data.maxLon >= data.minLon, {
  message: 'Longitud máxima debe ser >= longitud mínima',
  path: ['maxLon'],
});

export const updateRegionSchema = z.object({
  name: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo')
    .optional(),
  minLat: z
    .number()
    .min(-90, 'Latitud mínima debe ser >= -90')
    .max(90, 'Latitud mínima debe ser <= 90')
    .optional(),
  maxLat: z
    .number()
    .min(-90, 'Latitud máxima debe ser >= -90')
    .max(90, 'Latitud máxima debe ser <= 90')
    .optional(),
  minLon: z
    .number()
    .min(-180, 'Longitud mínima debe ser >= -180')
    .max(180, 'Longitud mínima debe ser <= 180')
    .optional(),
  maxLon: z
    .number()
    .min(-180, 'Longitud máxima debe ser >= -180')
    .max(180, 'Longitud máxima debe ser <= 180')
    .optional(),
  isDefault: z.boolean().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color debe ser hexadecimal válido (ej: #FF0000)')
    .optional(),
});
