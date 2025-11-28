// src/app/sessionStorage.js

const STORAGE_KEY = 'wue_session';

export function saveSession({ token, user }) {
  try {
    const payload = { token, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Error guardando sesión en localStorage:', err);
  }
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw);
    return {
      token: parsed.token || null,
      user: parsed.user || null,
    };
  } catch (err) {
    console.error('Error leyendo sesión desde localStorage:', err);
    return { token: null, user: null };
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error limpiando sesión en localStorage:', err);
  }
}
