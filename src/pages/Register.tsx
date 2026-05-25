// src/pages/Register.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthContext";
import "../styles/pages/AuthPage.scss";

export default function Register() {
  const { register, isAuthLoading, authError, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("MX");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Si ya está logueado, redirigimos (por si entra aquí ya autenticado)
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || "/account";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await register({ name, email, password, country });
    if (result.ok) {
      const from = location.state?.from || "/account";
      navigate(from, { replace: true });
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__inner">
        <section className="auth-card auth-card--register">
          <header className="auth-card__header">
            <p className="auth-card__eyebrow">Únete a What's Up Earth?</p>
            <h1 className="auth-card__title">Crear cuenta</h1>
            <p className="auth-card__subtitle">
              Guarda tus configuraciones favoritas y personaliza tu experiencia.
            </p>
          </header>

          {authError && (
            <p className="auth-card__error">
              {authError?.data?.message || "No se pudo crear la cuenta"}
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__field">
              <label htmlFor="register-name">Nombre</label>
              <input
                id="register-name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-form__field">
              <label htmlFor="register-country">País</label>
              <input
                id="register-country"
                type="text"
                placeholder="MX"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className="auth-form__field">
              <label htmlFor="register-email">Correo electrónico</label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="tu-correo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-form__field">
              <label htmlFor="register-password">Contraseña</label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <small className="auth-form__help">
                Usa al menos 6 caracteres. Más seguro si mezclas letras y
                números.
              </small>
            </div>

            <div className="auth-form__actions">
              <button
                type="submit"
                className="btn btn--primary auth-form__submit"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </div>
          </form>

          <footer className="auth-card__footer">
            <p className="auth-card__hint">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="auth-link">
                Iniciar sesión
              </Link>
            </p>
          </footer>
        </section>
      </div>
    </div>
  );
}
