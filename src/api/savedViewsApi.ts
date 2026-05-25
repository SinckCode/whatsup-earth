// src/api/savedViewsApi.js
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "https://api-whatsupearth.angelonesto.com/api";

async function handleResponse(res: any) {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `Error ${res.status}`;
    const error: any = new Error(msg);
    error.status = res.status;
    error.details = data;
    throw error;
  }

  return data;
}

export async function fetchSavedViews(token: any) {
  const res = await fetch(`${API_BASE}/saved-views`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
}

export async function createSavedView(token: any, payload: any) {
  const res = await fetch(`${API_BASE}/saved-views`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function deleteSavedView(token: any, id: any) {
  const res = await fetch(`${API_BASE}/saved-views/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
}
