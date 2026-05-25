// src/api/accountApi.js

// Si ya tienes un API_BASE_URL en otro archivo, reutilízalo.
// Aquí lo dejo simple para que lo adaptes:
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api-whatsupearth.angelonesto.com";

export async function updateMe(token, payload) {
  const res = await fetch(`${API_BASE_URL}/api/me`, {
    method: "PATCH", // o "PUT" si tu backend lo maneja así
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "No se pudo actualizar el perfil";
    try {
      const errorData = await res.json();
      if (errorData?.message) message = errorData.message;
    } catch (_err) {
      // ignoramos parse error
    }
    throw new Error(message);
  }

  // Idealmente tu backend regresa el usuario actualizado
  const data = await res.json();
  return data; // { user: { ... } } o directamente el user (ajustas abajo)
}
