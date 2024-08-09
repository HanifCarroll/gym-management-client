import { useSnackbar } from '@/context/snackbar-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { Member, MemberData, MemberStatus } from '@/types/member';

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

export const useGetMembers = () => {
  return useQuery({
    queryKey: [ 'members', 'list' ],
    queryFn: async () => {
      const { data } = await apiClient.get<Member[]>('members')
      return data;
    },
  });
};

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

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`members/${id}`),
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
