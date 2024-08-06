import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/axios-client.api';


const getClasses = async () => {
  const response = await apiClient.get('/classes');
  return response.data;
};

const getClass = async (id: number) => {
  const response = await apiClient.get(`/classes/${id}`);
  return response.data;
};

const createClass = async (data: any) => {
  const response = await apiClient.post('/classes', data);
  return response.data;
};

const updateClass = async (id: number, data: any) => {
  const response = await apiClient.patch(`/classes/${id}`, data);
  return response.data;
};

const deleteClass = async (id: number) => {
  const response = await apiClient.delete(`/classes/${id}`);
  return response.data;
};

export const useClasses = () => useQuery({
  queryKey: [ 'classes' ],
  queryFn: getClasses
});

export const useClass = (id: number) => useQuery({
  queryKey: [ 'class', id ],
  queryFn: () => getClass(id)
});

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'classes' ] });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'classes' ] });
      queryClient.invalidateQueries({ queryKey: [ 'class' ] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'classes' ] });
    },
  });
};