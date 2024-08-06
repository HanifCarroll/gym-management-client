import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/services/axios-client.api';


const getAttendances = async () => {
  const response = await apiClient.get('/attendances');
  return response.data;
};

const getAttendance = async (id: number) => {
  const response = await apiClient.get(`/attendances/${id}`);
  return response.data;
};

const createAttendance = async (data: any) => {
  const response = await apiClient.post('/attendances', data);
  return response.data;
};

const updateAttendance = async (id: number, data: any) => {
  const response = await apiClient.patch(`/attendances/${id}`, data);
  return response.data;
};

const deleteAttendance = async (id: number) => {
  const response = await apiClient.delete(`/attendances/${id}`);
  return response.data;
};

export const useAttendances = () => useQuery({ queryKey: [ 'attendances' ], queryFn: getAttendances });

export const useAttendance = (id: number) => useQuery({
  queryKey: [ 'attendance', id ],
  queryFn: () => getAttendance(id)
});

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'attendances' ] });
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateAttendance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'attendances' ] });
      queryClient.invalidateQueries({ queryKey: [ 'attendance' ] });
    },
  });
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'attendances' ] });
    },
  });
};