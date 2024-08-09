import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { Member } from '@/types';
import { useSnackbar } from '@/context/snackbar-context';

const updateMember = async (member: Member): Promise<Member> => {
  const { data } = await apiClient.patch(`/members/${member.id}`, member);
  return data;
};

export const useUpdateMember = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: updateMember,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ 'members', 'list' ] });
      showSnackbar('Member updated successfully!', 'success');
      onSuccess?.();
    },
    onError: (error) => {
      showSnackbar('Failed to updated member. Please try again.', 'error');
      console.error('Error updated member:', error);
    },
  });
};
