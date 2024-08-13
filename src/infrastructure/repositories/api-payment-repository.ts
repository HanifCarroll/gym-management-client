import { AxiosInstance } from 'axios';
import { Member, Payment, PaymentWithMember } from '@/core/entities';
import { PaymentRepository } from '@/core/repositories';
import { MEMBERS_URL, PAYMENTS_URL } from '@/infrastructure/api-client';

export class ApiPaymentRepository implements PaymentRepository {
  constructor(private apiClient: AxiosInstance) {}

  async initiatePayment(
    amount: number,
    memberId: string,
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const response = await this.apiClient.post<{
      clientSecret: string;
      paymentIntentId: string;
    }>(`${PAYMENTS_URL}/initiate`, { amount, memberId });
    return response.data;
  }

  async confirmPayment(paymentIntentId: string): Promise<void> {
    await this.apiClient.post(`${PAYMENTS_URL}/confirm/${paymentIntentId}`);
  }

  async getPaymentHistory(): Promise<Payment[]> {
    const response = await this.apiClient.get<Payment[]>(
      `${PAYMENTS_URL}/history`,
    );
    return response.data;
  }

  async getPaymentsWithMembers(): Promise<PaymentWithMember[]> {
    const [paymentsResponse, membersResponse] = await Promise.all([
      this.apiClient.get<Payment[]>(`${PAYMENTS_URL}/history`),
      this.apiClient.get<Member[]>(MEMBERS_URL),
    ]);

    const memberMap = new Map(
      membersResponse.data.map((member) => [
        member.id,
        `${member.firstName} ${member.lastName}`,
      ]),
    );

    return paymentsResponse.data.map((payment) => ({
      ...payment,
      memberName: memberMap.get(payment.memberId) || 'Unknown Member',
    }));
  }
}
