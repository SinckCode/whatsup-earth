import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string('Email es requerido')
    .email('Email no válido'),
  password: z
    .string('Contraseña es requerida')
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener mayúsculas')
    .regex(/[0-9]/, 'Debe contener números'),
  name: z
    .string('Nombre es requerido')
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo'),
  country: z
    .string('País es requerido')
    .length(2, 'País debe ser código de 2 letras')
    .default('MX')
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string('Email es requerido')
    .email('Email no válido'),
  password: z
    .string('Contraseña es requerida')
    .min(1, 'Contraseña no puede estar vacía'),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo')
    .optional(),
  country: z
    .string()
    .length(2, 'País debe ser código de 2 letras')
    .optional(),
  bio: z
    .string()
    .max(500, 'Bio muy larga')
    .optional(),
  avatar: z
    .string()
    .url('Avatar debe ser una URL válida')
    .optional(),
});

export const updatePreferencesSchema = z.object({
  theme: z.enum(['dark', 'light']).optional(),
  defaultCategory: z.string().optional(),
  defaultView: z.enum(['map', 'timeline', 'stats']).optional(),
  defaultTimeRange: z.string().optional(),
});
