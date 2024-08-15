import { ApiPaymentRepository } from '../../../core/repositories';
import { PaymentServiceImpl } from '../../../core/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/app/ui/context';
import { apiClient } from '@/core/api-client';
import { Payment, PaymentWithMember } from '@/core/entities';

const paymentRepository = new ApiPaymentRepository(apiClient);
const paymentService = new PaymentServiceImpl(paymentRepository);

export const useInitiatePayment = (
  onSuccess?: (data: { clientSecret: string; paymentIntentId: string }) => void,
) => {
  const { showSnackbar } = useSnackbar();
  return useMutation<
    { clientSecret: string; paymentIntentId: string },
    Error,
    { amount: number; memberId: string }
  >({
    mutationFn: ({ amount, memberId }) =>
      paymentService.initiatePayment(amount, memberId),
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      showSnackbar('Failed to initiate payment. Please try again.', 'error');
      console.error('Error initiating payment:', error);
    },
  });
};

export const useConfirmPayment = () => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (paymentIntentId: string) =>
      paymentService.confirmPayment(paymentIntentId),
    onSuccess: async () => {
      showSnackbar('Payment successful!', 'success');
      await queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
    },
    onError: (error) => {
      showSnackbar(
        'Payment confirmed on Stripe but failed to update our records. Please contact support.',
        'error',
      );
      console.error('Error confirming payment:', error);
    },
  });
};

export const usePaymentHistory = () => {
  return useQuery<Payment[], Error>({
    queryKey: ['paymentHistory'],
    queryFn: () => paymentService.getPaymentHistory(),
  });
};

export const usePaymentsWithMembers = () => {
  return useQuery<PaymentWithMember[], Error>({
    queryKey: ['paymentsWithMembers'],
    queryFn: () => paymentService.getPaymentsWithMembers(),
  });
};
