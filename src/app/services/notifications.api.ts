import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/services/axios-client.api';


const getNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

const getNotification = async (id: number) => {
  const response = await apiClient.get(`/notifications/${id}`);
  return response.data;
};

const createNotification = async (data: any) => {
  const response = await apiClient.post('/notifications', data);
  return response.data;
};

const updateNotification = async (id: number, data: any) => {
  const response = await apiClient.patch(`/notifications/${id}`, data);
  return response.data;
};

const deleteNotification = async (id: number) => {
  const response = await apiClient.delete(`/notifications/${id}`);
  return response.data;
};

export const useNotifications = () => useQuery({
  queryKey: [ 'notifications' ],
  queryFn: getNotifications
});

export const useNotification = (id: number) => useQuery({
  queryKey: [ 'notification', id ],
  queryFn: () => getNotification(id)
});

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'notifications' ] });
    },
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'notifications' ] });
      queryClient.invalidateQueries({ queryKey: [ 'notification' ] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'notifications' ] });
    },
  });
};