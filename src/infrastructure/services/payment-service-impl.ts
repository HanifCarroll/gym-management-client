import { PaymentService } from '@/core/services';
import { PaymentRepository } from '@/core/repositories';
import { Payment, PaymentWithMember } from '@/core/entities';

export class PaymentServiceImpl implements PaymentService {
  constructor(private paymentRepository: PaymentRepository) {}

  async initiatePayment(
    amount: number,
    memberId: string,
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    return this.paymentRepository.initiatePayment(amount, memberId);
  }

  async confirmPayment(paymentIntentId: string): Promise<void> {
    await this.paymentRepository.confirmPayment(paymentIntentId);
  }

  async getPaymentHistory(): Promise<Payment[]> {
    return this.paymentRepository.getPaymentHistory();
  }

  async getPaymentsWithMembers(): Promise<PaymentWithMember[]> {
    return this.paymentRepository.getPaymentsWithMembers();
  }
}
