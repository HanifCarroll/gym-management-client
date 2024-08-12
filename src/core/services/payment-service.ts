import { Payment, PaymentWithMember } from '../entities';

export interface PaymentService {
  initiatePayment(amount: number, memberId: string): Promise<{ clientSecret: string; paymentIntentId: string }>;

  confirmPayment(paymentIntentId: string): Promise<void>;

  getPaymentHistory(): Promise<Payment[]>;

  getPaymentsWithMembers(): Promise<PaymentWithMember[]>;
}