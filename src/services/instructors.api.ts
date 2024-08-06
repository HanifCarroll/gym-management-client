import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/axios-client.api';
import { Instructor } from '@/entities/instructor';


const getInstructors = async () => {
  const response = await apiClient.get<Instructor[]>('/instructors');
  return response.data;
};

const getInstructor = async (id: number) => {
  const response = await apiClient.get(`/instructors/${id}`);
  return response.data;
};

const createInstructor = async (data: any) => {
  const response = await apiClient.post('/instructors', data);
  return response.data;
};

const updateInstructor = async (id: number, data: any) => {
  const response = await apiClient.patch(`/instructors/${id}`, data);
  return response.data;
};

const deleteInstructor = async (id: number) => {
  const response = await apiClient.delete(`/instructors/${id}`);
  return response.data;
};

export const useInstructors = () => useQuery({
  queryKey: [ 'instructors' ],
  queryFn: getInstructors
});

export const useInstructor = (id: number) => useQuery({
  queryKey: [ 'instructor', id ],
  queryFn: () => getInstructor(id)
});

export const useCreateInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'instructors' ] });
    },
  });
};

export const useUpdateInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateInstructor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'instructors' ] });
      queryClient.invalidateQueries({ queryKey: [ 'instructor' ] });
    },
  });
};

export const useDeleteInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'instructors' ] });
    },
  });
};