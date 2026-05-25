// src/api/userApi.js
const API_BASE = "https://api-whatsupearth.angelonesto.com/api";

export async function getCurrentUser(token) {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo obtener la información del usuario");
  }

  return res.json();
}

// ✅ Actualizar nombre / país
export async function updateUserInfo(token, data) {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: "PUT", // ⬅️ IMPORTANTE: PUT (como tu backend)
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data), // { name, country }
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body?.message || `Error ${res.status} al actualizar la información de la cuenta`;
    throw new Error(message);
  }

  return res.json(); // devuelve el usuario actualizado
}

// ✅ Actualizar preferencias
export async function updateUserPreferences(token, prefs) {
  const res = await fetch(`${API_BASE}/users/me/preferences`, {
    method: "PUT", // ⬅️ también PUT
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prefs), // { theme, defaultCategory, defaultView, defaultTimeRange }
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body?.message || `Error ${res.status} al actualizar tus preferencias`;
    throw new Error(message);
  }

  return res.json(); // puede devolver el user o sólo preferences (según tu API)
}
