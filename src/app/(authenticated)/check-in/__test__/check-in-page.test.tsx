import {
  CHECK_INS_MATCHER,
  MEMBERS_MATCHER,
  renderWithProviders,
} from '../../../../../test-utils';
import { CHECK_INS_URL } from '@/infrastructure/api-client';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckIn, Member } from '@/core/entities';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import CheckInPage from '../page';

const mockMembers: Member[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    status: 'Active',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    status: 'Inactive',
    createdAt: '',
    updatedAt: '',
  },
];

const mockCheckIns: CheckIn[] = [
  {
    id: '1',
    memberId: '1',
    dateTime: '2023-01-01T10:00:00Z',
    member: mockMembers[0],
  },
  {
    id: '2',
    memberId: '2',
    dateTime: '2023-01-02T11:00:00Z',
    member: mockMembers[1],
  },
];

const server = setupServer(
  http.get(MEMBERS_MATCHER, () => {
    return HttpResponse.json(mockMembers);
  }),
  http.get(`*${CHECK_INS_URL}`, ({ request }) => {
    const url = new URL(request.url);
    const memberId = url.searchParams.get('memberId');
    const filteredCheckIns = memberId
      ? mockCheckIns.filter((checkIn) => checkIn.memberId === memberId)
      : mockCheckIns;
    return HttpResponse.json(filteredCheckIns);
  }),
  http.post(`*${CHECK_INS_URL}`, () => {
    return HttpResponse.json(
      { message: 'Check-in successful' },
      { status: 201 },
    );
  }),
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CheckInPage', () => {
  test('renders the page title correctly', async () => {
    renderWithProviders(<CheckInPage />);
    expect(await screen.findByText('Gym Check-In System')).toBeInTheDocument();
  });

  test('displays loading animation when data is being fetched', async () => {
    renderWithProviders(<CheckInPage />);
    expect(await screen.findByTestId('loading-animation')).toBeInTheDocument();
  });

  test('displays error message when there is an error fetching data', async () => {
    server.use(
      http.get(MEMBERS_MATCHER, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    renderWithProviders(<CheckInPage />);
    expect(await screen.findByText('An error occurred')).toBeInTheDocument();
  });

  test('renders member select dropdown with correct options', async () => {
    renderWithProviders(<CheckInPage />);
    const select = await screen.findByLabelText('Select Member');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
  });

  test('updates selected member when an option is chosen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckInPage />);
    const select = await screen.findByRole('combobox', {
      name: /select member/i,
    });
    await user.click(select);
    await user.click(screen.getByText('John Doe'));
    expect(select).toHaveTextContent('John Doe');
  });

  test('disables check-in button when no member is selected', async () => {
    renderWithProviders(<CheckInPage />);
    expect(
      await screen.findByRole('button', { name: 'Check In' }),
    ).toBeDisabled();
  });

  test('enables check-in button when a member is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckInPage />);
    const select = await screen.findByRole('combobox', {
      name: /select member/i,
    });
    await user.click(select);
    await user.click(screen.getByText('Jane Smith'));
    expect(screen.getByRole('button', { name: 'Check In' })).toBeEnabled();
  });

  test('displays warning for inactive members', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckInPage />);
    const select = await screen.findByRole('combobox', {
      name: /select member/i,
    });
    await user.click(select);
    await user.click(screen.getByText('Jane Smith'));
    expect(
      await screen.findByText('Warning: The selected member is not active.'),
    ).toBeInTheDocument();
  });

  test('performs check-in when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckInPage />);
    const select = await screen.findByRole('combobox', {
      name: /select member/i,
    });
    await user.click(select);
    await user.click(screen.getByText('Jane Smith'));
    await user.click(screen.getByRole('button', { name: 'Check In' }));
    expect(await screen.findByText('Check-in successful!')).toBeInTheDocument();
  });

  test('displays error message after failed check-in', async () => {
    server.use(
      http.post(CHECK_INS_MATCHER, () => {
        return HttpResponse.json(
          { message: 'Check-in failed' },
          { status: 500 },
        );
      }),
    );
    const user = userEvent.setup();
    renderWithProviders(<CheckInPage />);
    const select = await screen.findByRole('combobox', {
      name: /select member/i,
    });
    await user.click(select);
    await user.click(screen.getByText('Jane Smith'));
    await user.click(screen.getByRole('button', { name: 'Check In' }));
    expect(await screen.findByText('Check-in failed')).toBeInTheDocument();
  });

  test('filters check-ins when a member is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckInPage />);
    const select = await screen.findByRole('combobox', {
      name: /select member/i,
    });
    await user.click(select);
    await user.click(screen.getByText('John Doe'));
    await waitFor(() => {
      expect(screen.getByTestId('ag-grid')).toBeInTheDocument();
    });
  });

  test('displays all check-ins when no member is selected', async () => {
    renderWithProviders(<CheckInPage />);
    await waitFor(() => {
      expect(screen.getByTestId('ag-grid')).toBeInTheDocument();
    });
  });
});
