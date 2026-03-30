import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export function useWorkspaces() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.workspaces.all,
    queryFn: () => apiClient<any[]>('/workspaces'),
  });

  const create = useMutation({
    mutationFn: (data: { name: string; slug: string }) => 
      apiClient<any>('/workspaces', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
    }
  });

  return { workspaces: query.data || [], isLoading: query.isLoading, createWorkspace: create.mutateAsync };
}
