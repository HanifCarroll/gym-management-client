import { useSnackbar } from '@/context/snackbar-context';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { MemberData } from '@/types/members/member';

export const useRegisterMember = (onSuccess?: () => void) => {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: MemberData) => apiClient.post('/members', data),
    onSuccess: () => {
      showSnackbar('Member registered successfully!', 'success');
      onSuccess?.();
    },
    onError: (error) => {
      showSnackbar('Failed to register member. Please try again.', 'error');
      console.error('Error registering member:', error);
    },
  });
};
