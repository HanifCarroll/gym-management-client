import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { useSnackbar } from '@/context/snackbar-context';

const deleteMember = async (id: string): Promise<void> => {
  await apiClient.delete(`members/${id}`);
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: deleteMember,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ 'members', 'list' ] });
      showSnackbar('Member deleted successfully!', 'success');
    },
    onError: (error) => {
      showSnackbar('Failed to delete member. Please try again.', 'error');
      console.error('Error delete member:', error);
    },
  });
};