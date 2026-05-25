// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthContext";
import "../styles/pages/AuthPage.scss";

export default function Login() {
  const { login, isAuthLoading, authError, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Si ya está logueado, redirigimos desde un efecto (no en el render)
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || "/account";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    await login({ email, password });
    // La redirección la hace el useEffect cuando isAuthenticated cambie a true
  }

  return (
    <div className="auth-page">
      <div className="auth-page__inner">
        <section className="auth-card auth-card--login">
          <header className="auth-card__header">
            <p className="auth-card__eyebrow">Bienvenido de vuelta</p>
            <h1 className="auth-card__title">Iniciar sesión</h1>
            <p className="auth-card__subtitle">
              Entra para acceder a tus vistas guardadas, favoritos y panel de
              cuenta.
            </p>
          </header>

          {authError && (
            <p className="auth-card__error">
              {authError?.message || authError?.data?.error || "Error al iniciar sesión"}
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__field">
              <label htmlFor="login-email">Correo electrónico</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="tu-correo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-form__field">
              <label htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-form__actions">
              <button
                type="submit"
                className="btn btn--primary auth-form__submit"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>

          <footer className="auth-card__footer">
            <p className="auth-card__hint">
              ¿Aún no tienes cuenta?{" "}
              <Link to="/register" className="auth-link">
                Crear una cuenta
              </Link>
            </p>
          </footer>
        </section>
      </div>
    </div>
  );
}
