import RegisterMember from '../page';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { registerMemberPageServer } from '@/app/(authenticated)/register/__test__/register-page-test-utils';
import { MEMBERS_MATCHER, renderWithProviders } from '@/app/ui/test-utils';
import { HttpResponse, http } from 'msw';

beforeAll(() => registerMemberPageServer.listen());
afterEach(() => registerMemberPageServer.resetHandlers());
afterAll(() => registerMemberPageServer.close());

function setup() {
  const user = userEvent.setup();
  const utils = renderWithProviders(<RegisterMember />);

  const fillForm = async (
    firstName = 'John',
    lastName = 'Doe',
    email = 'john.doe@example.com',
    phone = '1234567890',
  ) => {
    await user.type(screen.getByLabelText(/First Name/), firstName);
    await user.type(screen.getByLabelText(/Last Name/), lastName);
    await user.type(screen.getByLabelText(/Email/), email);
    await user.type(screen.getByLabelText(/Phone/), phone);
  };

  const getRegisterButton = () =>
    screen.getByRole('button', { name: 'Register Member' });

  const submitForm = async () => {
    await user.click(getRegisterButton());
  };

  return {
    user,
    ...utils,
    fillForm,
    getRegisterButton,
    submitForm,
  };
}

describe('Register', () => {
  test('renders the page title correctly', () => {
    renderWithProviders(<RegisterMember />);
    expect(screen.getByText('Register New Member')).toBeInTheDocument();
  });

  test('renders all form fields', () => {
    renderWithProviders(<RegisterMember />);
    expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/)).toBeInTheDocument();
  });

  test('submits form data when register button is clicked', async () => {
    const { fillForm, submitForm } = setup();

    await fillForm();
    await submitForm();

    // Wait for the form to reset after successful submission
    await waitFor(() => {
      expect(screen.getByLabelText(/First Name/)).toHaveValue('');
      expect(screen.getByLabelText(/Last Name/)).toHaveValue('');
      expect(screen.getByLabelText(/Email/)).toHaveValue('');
      expect(screen.getByLabelText(/Phone/)).toHaveValue('');
    });

    expect(
      await screen.findByText('Member registered successfully!'),
    ).toBeInTheDocument();
  });

  test('displays error message when registration fails', async () => {
    registerMemberPageServer.use(
      http.post(`${MEMBERS_MATCHER}`, () => {
        return HttpResponse.json(
          { message: 'Registration failed' },
          { status: 500 },
        );
      }),
    );

    const { fillForm, submitForm } = setup();

    await fillForm();
    await submitForm();

    await waitFor(() => {
      expect(screen.getByText('Failed to register member')).toBeInTheDocument();
    });
  });
});
