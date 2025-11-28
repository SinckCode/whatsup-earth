// src/hooks/useUpdateMe.js
import { useMutation } from "@tanstack/react-query";
import {
  updateUserInfo,
  updateUserPreferences,
} from "../api/userApi";
import { useAuth } from "../app/AuthContext";

export function useUpdateMe() {
  const { token, updateUser } = useAuth();

  const mutation = useMutation({
    // payload: { name, country, preferences: { ... } }
    mutationFn: async (payload) => {
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const { name, country, preferences } = payload;
      let lastUser = null;

      // 1) Actualizar info básica si viene algo
      if (name !== undefined || country !== undefined) {
        const infoRes = await updateUserInfo(token, { name, country });
        const userFromInfo = infoRes.user ?? infoRes;
        lastUser = userFromInfo || lastUser;
      }

      // 2) Actualizar preferencias si vienen en el payload
      if (preferences) {
        const prefsRes = await updateUserPreferences(token, preferences);
        const userFromPrefs = prefsRes.user ?? prefsRes;
        lastUser = userFromPrefs || lastUser;
      }

      // lastUser debería ser la versión más fresca del usuario
      return lastUser;
    },
    onSuccess: (updatedUser) => {
      if (updatedUser) {
        updateUser(updatedUser); // actualiza contexto + sessionStorage
      }
    },
  });

  return mutation;
}
