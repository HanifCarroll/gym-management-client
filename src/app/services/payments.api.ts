import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/services/axios-client.api';


const getPayments = async () => {
  const response = await apiClient.get('/payments');
  return response.data;
};

const getPayment = async (id: number) => {
  const response = await apiClient.get(`/payments/${id}`);
  return response.data;
};

const createPayment = async (data: any) => {
  const response = await apiClient.post('/payments', data);
  return response.data;
};

const updatePayment = async (id: number, data: any) => {
  const response = await apiClient.patch(`/payments/${id}`, data);
  return response.data;
};

const deletePayment = async (id: number) => {
  const response = await apiClient.delete(`/payments/${id}`);
  return response.data;
};

export const usePayments = () => useQuery({
  queryKey: [ 'payments' ],
  queryFn: getPayments
});

export const usePayment = (id: number) => useQuery({
  queryKey: [ 'payment', id ],
  queryFn: () => getPayment(id)
});

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'payments' ] });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'payments' ] });
      queryClient.invalidateQueries({ queryKey: [ 'payment' ] });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'payments' ] });
    },
  });
};