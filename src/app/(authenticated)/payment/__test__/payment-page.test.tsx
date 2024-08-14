import PaymentPage from '../page';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { paymentPageServer } from '@/app/(authenticated)/payment/__test__/payment-page-test-utils';
import { renderWithProviders } from '@/app/ui/test-utils';

const mocks = vi.hoisted(() => ({
  mockStripe: {
    loadStripe: vi.fn().mockResolvedValue({
      elements: vi.fn(() => ({ create: vi.fn(), getElement: vi.fn() })),
      createToken: vi.fn(),
      createSource: vi.fn(),
      createPaymentMethod: vi.fn(),
      confirmCardPayment: vi
        .fn()
        .mockResolvedValue({ paymentIntent: { status: 'succeeded' } }),
      confirmCardSetup: vi.fn(),
      paymentRequest: vi.fn(),
      _registerWrapper: vi.fn(),
    }),
  },
}));
vi.mock('@stripe/stripe-js', () => {
  return mocks.mockStripe;
});

beforeAll(() => {
  paymentPageServer.listen();
  // Set the Stripe publishable key in the environment
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'test_publishable_key';
});
afterEach(() => paymentPageServer.resetHandlers());
afterAll(() => paymentPageServer.close());

async function setup() {
  const user = userEvent.setup();
  const utils = renderWithProviders(<PaymentPage />);

  // Wait for the form to be rendered
  await screen.findByRole('heading', { name: /one-time payment/i });

  return {
    user,
    selectMember: async (memberName: string) => {
      const select = await screen.findByRole('combobox', {
        name: /select member/i,
      });
      await user.click(select);
      await user.click(screen.getByText(memberName));
    },
    ...utils,
  };
}

describe('PaymentPage', () => {
  test('renders the page title correctly', async () => {
    await setup();
    expect(
      screen.getByRole('heading', { name: /one-time payment/i }),
    ).toBeInTheDocument();
  });

  test('renders PaymentForm when Stripe is loaded', async () => {
    await setup();
    expect(screen.getByLabelText(/member/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pay/i })).toBeInTheDocument();
  });

  test('displays member select dropdown with correct options', async () => {
    await setup();
    const memberSelect = screen.getByLabelText(/member/i);
    await userEvent.click(memberSelect);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('disables submit button when form is invalid', async () => {
    const { selectMember } = await setup();
    const payButton = screen.getByRole('button', { name: /pay/i });
    expect(payButton).toBeDisabled();

    // Select a member but leave amount empty
    await selectMember('John Doe');
    screen.debug(undefined, Infinity);
    expect(payButton).toBeDisabled();
  });

  test('enables submit button when form is valid', async () => {
    const { user, selectMember } = await setup();
    const payButton = screen.getByRole('button', { name: /pay/i });

    await selectMember('John Doe');
    await user.type(screen.getByLabelText(/amount/i), '50');

    expect(payButton).toBeEnabled();
  });

  test('shows success message and clears form for successful payment', async () => {
    const { user, selectMember } = await setup();

    await selectMember('John Doe');
    await user.type(screen.getByLabelText(/amount/i), '50');

    screen.debug(undefined, Infinity);
    const payButton = screen.getByRole('button', { name: /pay/i });
    await user.click(payButton);

    await waitFor(async () => {
      expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
    });
    const select = await screen.findByRole('combobox', {
      name: /select member/i,
    });
    expect(select).not.toHaveTextContent('John Doe');
    expect(screen.getByLabelText(/amount/i)).toHaveValue(null);
  });
});
