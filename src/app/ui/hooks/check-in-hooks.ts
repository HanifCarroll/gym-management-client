import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api-client';
import { CheckIn } from '@/core/entities';
import { ApiCheckInRepository } from '@/infrastructure/repositories';
import { CheckInServiceImpl } from '@/infrastructure/services';

const checkInRepository = new ApiCheckInRepository(apiClient);
const checkInService = new CheckInServiceImpl(checkInRepository);

export const useGetCheckIns = () => {
  return useQuery<CheckIn[], Error>({
    queryKey: ['checkIns'],
    queryFn: () => checkInService.getCheckIns(),
  });
};

export const useCreateCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation<CheckIn, Error, string>({
    mutationFn: (memberId: string) => checkInService.createCheckIn(memberId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['checkIns'] });
    },
  });
};
