import { Payment, PaymentWithMember } from '@/core/entities';
import { ApiPaymentRepository } from '@/core/repositories';

export class PaymentServiceImpl {
  private paymentRepository: ApiPaymentRepository;

  constructor(paymentRepository: ApiPaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

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
