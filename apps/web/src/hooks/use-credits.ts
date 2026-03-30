import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useCredits() {
  const query = useQuery({
    queryKey: ['billing', 'credits'],
    queryFn: () => apiClient<{ remaining: number; max: number; status: string }>('/billing/subscription'),
  });

  return { 
     credits: query.data,
     isLoading: query.isLoading,
     isExhausted: query.data?.remaining === 0 
  };
}
