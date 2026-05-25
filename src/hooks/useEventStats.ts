import { useQuery } from '@tanstack/react-query';
import { eventStats } from '../api/endpoints';
import { useEffect } from 'react';

export function useEventStats(eventId: string) {
  const statsQuery = useQuery({
    queryKey: ['event-stats', eventId],
    queryFn: () => eventStats.get(eventId),
    enabled: !!eventId,
  });

  // Record view on mount
  useEffect(() => {
    if (eventId) {
      eventStats.recordView(eventId).catch(() => {});
    }
  }, [eventId]);

  return {
    stats: statsQuery.data || {
      eventId,
      viewCount: 0,
      favoriteCount: 0,
      commentCount: 0,
    },
    isLoading: statsQuery.isPending,
  };
}
