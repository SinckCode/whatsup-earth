// src/api/config.js

// Ideal: definir esto en tu .env de Vite:
// VITE_API_URL=https://api-whatsupearth.angelonesto.com/api
const DEFAULT_BASE_URL = 'https://api-whatsupearth.angelonesto.com/api';

export const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_BASE_URL;

/**
 * Helper para construir headers de autorización.
 * @param {string|null} token
 * @returns {{[key: string]: string}}
 */
export function authHeader(token) {
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}
