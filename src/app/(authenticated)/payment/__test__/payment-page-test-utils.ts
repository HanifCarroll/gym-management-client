import { MEMBERS_MATCHER } from '@/app/ui/test-utils';
import { PAYMENTS_URL } from '@/core/api-client';
import { Member } from '@/core/entities';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

const mockMembers: Member[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    status: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '0987654321',
    status: 'Active',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

export const paymentPageServer = setupServer(
  http.get(MEMBERS_MATCHER, () => {
    return HttpResponse.json(mockMembers);
  }),
  http.post(`*${PAYMENTS_URL}/initiate`, () => {
    return HttpResponse.json({
      clientSecret: 'test_client_secret',
      paymentIntentId: 'test_payment_intent_id',
    });
  }),
  http.post(`*${PAYMENTS_URL}/confirm*`, () => {
    return HttpResponse.json({ message: 'Payment confirmed successfully' });
  }),
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
  }),
);

const mockElement = () => ({
  mount: vi.fn(),
  destroy: vi.fn(),
  on: vi.fn(),
  update: vi.fn(),
});

export const mockStripe = () => ({
  elements: vi.fn(() => ({ create: vi.fn(), getElement: vi.fn() })),
  createToken: vi.fn(),
  createSource: vi.fn(),
  createPaymentMethod: vi.fn(),
  confirmCardPayment: vi.fn(),
  confirmCardSetup: vi.fn(),
  paymentRequest: vi.fn(),
  _registerWrapper: vi.fn(),
});

vi.mock('@stripe/react-stripe-js', () => {
  const stripe = vi.importActual('@stripe/react-stripe-js');

  return {
    ...stripe,
    Element: () => {
      return mockElement;
    },
    useStripe: () => {
      return mockStripe;
    },
    useElements: () => {
      return mockStripe().elements();
    },
  };
});

// Mock loadStripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue(mockStripe),
}));
