import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export function useNotifications() {
  const query = useQuery({
     queryKey: queryKeys.notifications,
     queryFn: () => apiClient<any[]>('/notifications')
  });
  
  return { notifications: query.data || [], unreadCount: query.data?.filter(n => !n.read).length || 0 };
}
