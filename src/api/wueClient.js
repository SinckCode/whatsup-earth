// src/api/wueClient.js
const API_BASE = import.meta.env.VITE_WUE_API_BASE;

export async function wueRequest(path, { method = "GET", token, body } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // si no hay body, data se queda en null
  }

  if (!res.ok) {
    const err = new Error(data?.message || "Error en la API de WhatsUp-Earth");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
