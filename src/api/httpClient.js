// src/api/httpClient.js
import { API_BASE_URL, authHeader } from './config';

/**
 * Wrapper simple alrededor de fetch para tu API.
 *
 * @param {string} path - Ruta relativa, por ejemplo '/auth/login'
 * @param {Object} options
 * @param {'GET'|'POST'|'PUT'|'DELETE'|'PATCH'} [options.method]
 * @param {Object} [options.body] - Se serializa como JSON
 * @param {string} [options.token] - JWT opcional
 * @param {Object} [options.extraHeaders] - Headers adicionales
 */
export async function apiFetch(path, {
  method = 'GET',
  body,
  token,
  extraHeaders = {},
} = {}) {
  const url = `${API_BASE_URL}${path}`;

  const headers = {
    'Content-Type': 'application/json',
    ...authHeader(token),
    ...extraHeaders,
  };

  const fetchOptions = {
    method,
    headers,
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  let data;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || 'Error en la petición');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
