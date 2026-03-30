import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export function useDeployments(projectId: string) {
  const query = useQuery({
     queryKey: queryKeys.deployments.list(projectId),
     queryFn: () => apiClient<any[]>(`/deployments?projectId=${projectId}`),
     enabled: !!projectId,
     refetchInterval: 5000 // Poll intensely cleanly properly logically cleanly safely structurally
  });
  
  return { deployments: query.data || [], isLoading: query.isLoading };
}
