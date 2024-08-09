import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { useSnackbar } from '@/context/snackbar-context';

interface InitiatePaymentData {
  amount: number;
  memberId: string;
}

interface InitiatePaymentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export const useInitiatePayment = (onSuccess?: (data: InitiatePaymentResponse) => void) => {
  const { showSnackbar } = useSnackbar();

  return useMutation<InitiatePaymentResponse, Error, InitiatePaymentData>({
    mutationFn: async (data: InitiatePaymentData) => {
      const response = await apiClient.post<InitiatePaymentResponse>('payments/initiate', data);
      return response.data;
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      showSnackbar('Failed to initiate payment. Please try again.', 'error');
      console.error('Error initiating payment:', error);
    },
  });
};