// src/api/authApi.js
import { apiFetch } from './httpClient';

/**
 * Registrar usuario
 * POST /api/auth/register
 */
export function registerUser({ name, email, password, country }) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: { name, email, password, country },
  });
}

/**
 * Login
 * POST /api/auth/login
 */
export function loginUser({ email, password }) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}
