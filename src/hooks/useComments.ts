import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comments } from '../api/endpoints';

export function useComments(eventId: string) {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ['comments', eventId],
    queryFn: () => comments.listByEvent(eventId),
    enabled: !!eventId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => comments.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      comments.update(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => comments.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
    },
  });

  return {
    comments: commentsQuery.data?.data || [],
    isLoading: commentsQuery.isPending,
    createComment: createMutation.mutate,
    updateComment: updateMutation.mutate,
    deleteComment: deleteMutation.mutate,
  };
}
