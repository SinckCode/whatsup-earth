// src/app/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  // Mientras revisamos si hay sesión guardada, puedes mostrar un loader
  if (isInitializing) {
    return (
      <div style={{ color: "#fff", padding: "2rem" }}>
        Cargando sesión...
      </div>
    );
  }

  // Si no está autenticado, redirigimos a /login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }} // para luego regresar si quieres
      />
    );
  }

  // Si está autenticado, mostramos el contenido protegido
  return <>{children}</>;
}
