import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { Member } from '@/types/member';

const fetchMembers = async (): Promise<Member[]> => {
  const { data } = await apiClient.get('members');
  return data;
};

export const useGetMembers = () => {
  return useQuery({
    queryKey: [ 'members', 'list' ],
    queryFn: fetchMembers,
  });
};
