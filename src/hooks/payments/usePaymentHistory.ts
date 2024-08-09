import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { Member } from '@/types';

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