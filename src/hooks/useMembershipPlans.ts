import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';

export interface MembershipPlan {
  id: string;
  name: string;
  duration: number;
  price: number;
}

const API_URL = 'membership-plans';

export const useMembershipPlans = () => {
  return useQuery<MembershipPlan[]>({
    queryKey: [ 'membershipPlans' ],
    queryFn: () => apiClient.get(API_URL).then((res) => res.data),
  });
};

export const useCreateMembershipPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPlan: Omit<MembershipPlan, 'id'>) => apiClient.post(API_URL, newPlan),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ 'membershipPlans' ] });
    },
  });
};

export const useUpdateMembershipPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updatedPlan }: MembershipPlan) => apiClient.patch(`${API_URL}/${id}`, updatedPlan),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ 'membershipPlans' ] });
    },
  });
};

export const useDeleteMembershipPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`${API_URL}/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ 'membershipPlans' ] });
    },
  });
};