import { useSnackbar } from '@/context/snackbar-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { Member } from '@/types';

interface InitiatePaymentData {
  amount: number;
  memberId: string;
}

interface InitiatePaymentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  status: string;
}

export interface PaymentWithMember extends Payment {
  memberName: string;
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

const fetchPaymentsWithMembers = async (): Promise<PaymentWithMember[]> => {
  const [ paymentsResponse, membersResponse ] = await Promise.all([
    apiClient.get<Payment[]>('payments/history'),
    apiClient.get<Member[]>('members')
  ]);

  const memberMap = new Map(membersResponse.data.map(member => [ member.id, `${member.firstName} ${member.lastName}` ]));

  return paymentsResponse.data.map(payment => ({
    ...payment,
    memberName: memberMap.get(payment.memberId) || 'Unknown Member'
  }));
};

export const usePaymentHistory = () => {
  return useQuery<PaymentWithMember[], Error>({
    queryKey: [ 'paymentsWithMembers' ],
    queryFn: fetchPaymentsWithMembers,
  });
};
