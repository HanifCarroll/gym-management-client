import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/axios-client.api';
import { MembershipPlan } from '@/entities/membership-plan';


const getMembershipPlans = async () => {
  const response = await apiClient.get<MembershipPlan[]>('/membership-plans');
  return response.data;
};

const getMembershipPlan = async (id: number) => {
  const response = await apiClient.get(`/membership-plans/${id}`);
  return response.data;
};

const createMembershipPlan = async (data: any) => {
  const response = await apiClient.post('/membership-plans', data);
  return response.data;
};

const updateMembershipPlan = async (id: number, data: any) => {
  const response = await apiClient.patch(`/membership-plans/${id}`, data);
  return response.data;
};

const deleteMembershipPlan = async (id: number) => {
  const response = await apiClient.delete(`/membership-plans/${id}`);
  return response.data;
};

export const useMembershipPlans = () => useQuery({
  queryKey: [ 'membershipPlans' ],
  queryFn: getMembershipPlans
});

export const useMembershipPlan = (id: number) => useQuery({
  queryKey: [ 'membershipPlan', id ],
  queryFn: () => getMembershipPlan(id)
});

export const useCreateMembershipPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMembershipPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'membershipPlans' ] });
    },
  });
};

export const useUpdateMembershipPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateMembershipPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'membershipPlans' ] });
      queryClient.invalidateQueries({ queryKey: [ 'membershipPlan' ] });
    },
  });
};

export const useDeleteMembershipPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMembershipPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'membershipPlans' ] });
    },
  });
};