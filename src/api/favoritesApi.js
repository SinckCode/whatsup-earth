const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api-whatsupearth.angelonesto.com";

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore json error
    }
    throw new Error(message);
  }
  return res.json();
}

/**
 * GET /api/favorites
 */
export async function fetchFavorites(token) {
  const res = await fetch(`${API_BASE_URL}/api/favorites`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

/**
 * POST /api/favorites
 * payload debe seguir la forma:
 * {
 *   eventId, title, category, link,
 *   coordinates: [lon, lat],
 *   firstDate, lastDate,
 *   note
 * }
 */
export async function addFavorite(token, payload) {
  const res = await fetch(`${API_BASE_URL}/api/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * DELETE /api/favorites/:id
 */
export async function deleteFavorite(token, id) {
  const res = await fetch(`${API_BASE_URL}/api/favorites/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // este endpoint responde solo con { message: ... }
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return true;
}
