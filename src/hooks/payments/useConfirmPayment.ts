import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { useSnackbar } from '@/context/snackbar-context';

export const useConfirmPayment = (onSuccess?: () => void) => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentIntentId: string) => apiClient.post(`payments/confirm/${paymentIntentId}`),
    onSuccess: async () => {
      showSnackbar('Payment successful!', 'success');
      await queryClient.invalidateQueries({ queryKey: [ 'paymentHistory' ] });
      onSuccess?.();
    },
    onError: (error) => {
      showSnackbar('Payment confirmed on Stripe but failed to update our records. Please contact support.', 'error');
      console.error('Error confirming payment:', error);
    },
  });
};