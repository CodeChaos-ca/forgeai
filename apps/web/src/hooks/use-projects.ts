import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export function useProjects(workspaceId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.projects.all(workspaceId),
    queryFn: () => apiClient<any[]>(`/projects/${workspaceId}`),
    enabled: !!workspaceId,
  });

  const create = useMutation({
    mutationFn: (data: { name: string; workspaceId: string }) => 
      apiClient<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: queryKeys.projects.all(workspaceId) });
    }
  });

  return { projects: query.data || [], isLoading: query.isLoading, createProject: create.mutateAsync };
}
