import { Member, MemberStatus } from '@/types/member';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/context/snackbar-context';
import { apiClient } from '@/utils/api';

const sanitizeMember = (member: Member): Partial<Member> => {
  const { id, firstName, lastName, email, phone, status } = member;
  const sanitizedMember = { id, firstName, lastName, email, phone, status };

  // Ensure status is a valid MemberStatus
  if (!Object.values(MemberStatus).includes(sanitizedMember.status)) {
    throw new Error('Invalid status');
  }

  return sanitizedMember;
};

const updateMember = async (member: Member): Promise<Member> => {
  const sanitizedMember = sanitizeMember(member);
  const { data } = await apiClient.patch(`/members/${member.id}`, sanitizedMember);
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
      showSnackbar('Failed to update member. Please try again.', 'error');
      console.error('Error updating member:', error);
    },
  });
};