// src/hooks/useSavedViews.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../app/AuthContext";
import {
  fetchSavedViews,
  createSavedView,
  deleteSavedView,
} from "../api/savedViewsApi";

export function useSavedViews() {
  const { token } = useAuth();
  const qc = useQueryClient();

  const savedViewsQuery = useQuery({
    queryKey: ["saved-views"],
    queryFn: () => fetchSavedViews(token),
    enabled: !!token, // solo si hay token
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createSavedView(token, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-views"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSavedView(token, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-views"] });
    },
  });

  return {
    savedViewsQuery,
    createSavedView: createMutation.mutateAsync,
    deleteSavedView: deleteMutation.mutateAsync,
  };
}
