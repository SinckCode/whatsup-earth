// src/app/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../api/authApi';
import { getCurrentUser } from '../api/userApi';
import { loadSession, saveSession, clearSession } from './sessionStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // 🔄 Cargar sesión almacenada al inicio
  useEffect(() => {
    const { token: storedToken, user: storedUser } = loadSession();

    if (!storedToken) {
      setIsInitializing(false);
      return;
    }

    // Primero ponemos token y user “cacheados”
    setToken(storedToken);
    setUser(storedUser);

    // Luego validamos contra la API
    (async () => {
      try {
        const freshUser = await getCurrentUser(storedToken);
        setUser(freshUser);
        saveSession({ token: storedToken, user: freshUser });
      } catch (err) {
        console.error('Error refrescando sesión al iniciar:', err);
        // Si el token ya no sirve, limpiamos todo
        setToken(null);
        setUser(null);
        clearSession();
      } finally {
        setIsInitializing(false);
      }
    })();
  }, []);

  // 👉 Login
  async function login({ email, password }) {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const data = await loginUser({ email, password });
      // data: { token, user }
      setToken(data.token);
      setUser(data.user);
      saveSession({ token: data.token, user: data.user });
      return { ok: true, user: data.user };
    } catch (err) {
      console.error('Error en login:', err);
      setAuthError(err);
      return { ok: false, error: err };
    } finally {
      setIsAuthLoading(false);
    }
  }

  // 👉 Register (opcional desde frontend)
  async function register({ name, email, password, country }) {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const data = await registerUser({ name, email, password, country });
      setToken(data.token);
      setUser(data.user);
      saveSession({ token: data.token, user: data.user });
      return { ok: true, user: data.user };
    } catch (err) {
      console.error('Error en register:', err);
      setAuthError(err);
      return { ok: false, error: err };
    } finally {
      setIsAuthLoading(false);
    }
  }

  // 👉 Refrescar datos del usuario (por ejemplo tras cambiar preferencias)
  async function refreshUser() {
    if (!token) return;
    try {
      const freshUser = await getCurrentUser(token);
      setUser(freshUser);
      saveSession({ token, user: freshUser });
      return freshUser;
    } catch (err) {
      console.error('Error refrescando usuario:', err);
    }
  }

  // 👉 🔥 Nuevo: actualizar usuario en memoria + sessionStorage
  function updateUser(newUser) {
    setUser(newUser);
    if (token) {
      saveSession({ token, user: newUser });
    }
  }

  // 👉 Logout
  function logout() {
    setToken(null);
    setUser(null);
    clearSession();
  }

  const value = {
    token,
    user,
    isInitializing,   // true mientras intenta restaurar sesión al inicio
    isAuthLoading,
    authError,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    refreshUser,
    setUser,   // lo dejas por compatibilidad, pero mejor usar updateUser
    updateUser // 👈 importante para el update /api/me
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
