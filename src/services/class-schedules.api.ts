import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/axios-client.api';


const getClassSchedules = async () => {
  const response = await apiClient.get('/class-schedules');
  return response.data;
};

const getClassSchedule = async (id: number) => {
  const response = await apiClient.get(`/class-schedules/${id}`);
  return response.data;
};

const createClassSchedule = async (data: any) => {
  const response = await apiClient.post('/class-schedules', data);
  return response.data;
};

const updateClassSchedule = async (id: number, data: any) => {
  const response = await apiClient.patch(`/class-schedules/${id}`, data);
  return response.data;
};

const deleteClassSchedule = async (id: number) => {
  const response = await apiClient.delete(`/class-schedules/${id}`);
  return response.data;
};

export const useClassSchedules = () => useQuery({
  queryKey: [ 'classSchedules' ],
  queryFn: getClassSchedules
});

export const useClassSchedule = (id: number) => useQuery({
  queryKey: [ 'classSchedule', id ],
  queryFn: () => getClassSchedule(id)
});

export const useCreateClassSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClassSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'classSchedules' ] });
    },
  });
};

export const useUpdateClassSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateClassSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'classSchedules' ] });
      queryClient.invalidateQueries({ queryKey: [ 'classSchedule' ] });
    },
  });
};

export const useDeleteClassSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClassSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'classSchedules' ] });
    },
  });
};