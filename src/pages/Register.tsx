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
            <div className="auth-card__error">
              <p>{authError?.message || authError?.data?.error || "No se pudo crear la cuenta"}</p>
              {authError?.data?.details && (
                <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
                  {Object.entries(authError.data.details).map(([field, msgs]: [string, any]) =>
                    (Array.isArray(msgs) ? msgs : [msgs]).map((msg: string, i: number) => (
                      <li key={`${field}-${i}`}>{msg}</li>
                    ))
                  )}
                </ul>
              )}
            </div>
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
                placeholder="Mínimo 8 caracteres con mayúsculas"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <small className="auth-form__help">
                Mínimo 8 caracteres. Debe contener al menos una mayúscula.
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
