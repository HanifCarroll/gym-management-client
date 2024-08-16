import PaymentPage from '../page';
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
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
    selectMembershipPlan: async (membershipPlanName: string) => {
      const select = await screen.findByRole('combobox', {
        name: /select plan/i,
      });
      await user.click(select);
      await user.click(screen.getByText(membershipPlanName));
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
    const memberSelect = await screen.findByRole('combobox', {
      name: /select member/i,
    });
    await userEvent.click(memberSelect);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('displays membership plan select dropdown with correct options', async () => {
    await setup();
    const membershipPlanSelect = await screen.findByRole('combobox', {
      name: /select plan/i,
    });
    await userEvent.click(membershipPlanSelect);
    expect(screen.getByText('1 Month')).toBeInTheDocument();
    expect(screen.getByText('6 Month')).toBeInTheDocument();
  });

  test('disables submit button when form is invalid', async () => {
    const { selectMember } = await setup();
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
    const payButton = screen.getByRole('button', { name: /pay/i });
    expect(payButton).toBeDisabled();

    // Select a member but leave membership plan empty
    await selectMember('John Doe');
    expect(payButton).toBeDisabled();
  });

  test('enables submit button when form is valid', async () => {
    const { selectMember, selectMembershipPlan } = await setup();
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
    const payButton = screen.getByRole('button', { name: /pay/i });

    await selectMember('John Doe');
    await selectMembershipPlan('1 Month');

    expect(payButton).toBeEnabled();
  });

  test('shows success message and clears form for successful payment', async () => {
    const { user, selectMember, selectMembershipPlan } = await setup();

    await selectMember('John Doe');
    await selectMembershipPlan('1 Month');

    const payButton = screen.getByRole('button', { name: /pay/i });
    await user.click(payButton);

    await waitFor(async () => {
      expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
    });
    const memberSelect = await screen.findByRole('combobox', {
      name: /select member/i,
    });
    const membershipPlanSelect = await screen.findByRole('combobox', {
      name: /select plan/i,
    });
    expect(memberSelect).not.toHaveTextContent('John Doe');
    expect(membershipPlanSelect).not.toHaveTextContent('1 Month');
    expect(screen.getByLabelText(/amount/i)).toHaveValue(null);
  });
});
