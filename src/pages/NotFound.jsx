import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        color: "#eaeaea",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif',
        textAlign: "center",
        padding: "24px",
      }}
    >
      <h1
        style={{
          fontSize: "96px",
          margin: "0",
          letterSpacing: "4px",
          fontWeight: "300",
          fontFamily: '"Cinzel", Georgia, serif',
        }}
      >
        404
      </h1>

      <p style={{ opacity: 0.8, fontSize: "20px", marginTop: "8px" }}>
        Página no encontrada
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "32px",
          padding: "12px 28px",
          borderRadius: "20px",
          border: "1px solid #232323",
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          cursor: "pointer",
          transition: "all 0.2s ease",
          fontSize: "16px",
        }}
        onMouseOver={(e) =>
          (e.target.style.background = "rgba(255,255,255,0.12)")
        }
        onMouseOut={(e) =>
          (e.target.style.background = "rgba(255,255,255,0.08)")
        }
      >
        Volver al inicio
      </button>
    </main>
  );
}
