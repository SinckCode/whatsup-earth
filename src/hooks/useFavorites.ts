// src/hooks/useFavorites.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFavorites,
  createFavorite,
  deleteFavorite,
} from "../api/favoritesApi";
import { useAuth } from "../app/AuthContext";

export function useFavorites() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavorites(token),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => createFavorite(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => deleteFavorite(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    favorites: data ?? [],
    isLoading,
    isError,
    error,
    createFavorite: createMutation.mutateAsync,
    deleteFavorite: deleteMutation.mutateAsync,
  };
}
