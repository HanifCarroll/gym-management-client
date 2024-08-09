import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';

const deleteMember = async (id: string): Promise<void> => {
  await apiClient.delete(`members/${id}`);
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMember,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ 'members', 'list' ] });
    },
  });
};