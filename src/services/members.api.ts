import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/axios-client.api';
import { Member } from '@/entities/member';


const getMembers = async () => {
  const response = await apiClient.get('/members');
  return response.data;
};

const getMember = async (id: number) => {
  const response = await apiClient.get(`/members/${id}`);
  return response.data;
};

const createMember = async (data: any) => {
  const response = await apiClient.post('/members', data);
  return response.data;
};

const updateMember = async (id: number, data: any) => {
  const response = await apiClient.patch(`/members/${id}`, data);
  return response.data;
};

const deleteMember = async (id: number) => {
  const response = await apiClient.delete(`/members/${id}`);
  return response.data;
};

export const useMembers = () => useQuery<Member[]>({ queryKey: [ 'members' ], queryFn: getMembers },);

export const useMember = (id: number) => useQuery({
  queryKey: [ 'member', id ],
  queryFn: () => getMember(id)
});

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'members' ] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'members' ] });
      queryClient.invalidateQueries({ queryKey: [ 'member' ] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'members' ] });
    },
  });
};
