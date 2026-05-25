import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '../api/endpoints';
import { useAuth } from '../app/AuthContext';

export function useNotifications() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notifications.list(),
    enabled: !!token,
  });

  const unreadCountQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notifications.unreadCount(),
    enabled: !!token,
    refetchInterval: 60000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notifications.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notifications.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notifications.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: notificationsQuery.data?.data || [],
    isLoading: notificationsQuery.isPending,
    unreadCount: unreadCountQuery.data?.count || 0,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
  };
}
