import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';

export interface CheckIn {
  id: string;
  memberId: string;
  dateTime: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const useCheckIns = (memberId?: string) => {
  return useQuery<CheckIn[], Error>({
    queryKey: [ 'checkIns', memberId ],
    queryFn: async () => {
      const response = await apiClient.get<CheckIn[]>(`check-in/history${memberId ? `?memberId=${memberId}` : ''}`);
      return response.data;
    },
    enabled: true
  });
};

export const useCreateCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation<CheckIn, Error, string>({
    mutationFn: async (memberId: string) => {
      const response = await apiClient.post<CheckIn>('check-in', { memberId });
      return response.data;
    },
    onSuccess: async (_, memberId) => {
      await queryClient.invalidateQueries({ queryKey: [ 'checkIns', memberId ] });
    },
  });
};