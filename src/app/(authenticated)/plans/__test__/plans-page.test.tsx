import MembershipPlanPage from '../page';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { membershipPlanPageServer } from '@/app/(authenticated)/plans/__test__/plans-page-test-utils';
import {
  MEMBERSHIP_PLANS_MATCHER,
  renderWithProviders,
} from '@/app/ui/test-utils';
import { HttpResponse, http } from 'msw';

beforeAll(() => membershipPlanPageServer.listen());
afterEach(() => membershipPlanPageServer.resetHandlers());
afterAll(() => membershipPlanPageServer.close());

function setup() {
  const user = userEvent.setup();
  const utils = renderWithProviders(<MembershipPlanPage />);

  return {
    user,
    ...utils,
  };
}

describe('MembershipPlanPage', () => {
  test('renders the page title correctly', async () => {
    renderWithProviders(<MembershipPlanPage />);
    expect(await screen.findByText('Membership Plans')).toBeInTheDocument();
  });

  test('displays loading animation when data is being fetched', async () => {
    renderWithProviders(<MembershipPlanPage />);
    expect(await screen.findByTestId('loading-animation')).toBeInTheDocument();
  });

  test('displays error message when there is an error fetching data', async () => {
    membershipPlanPageServer.use(
      http.get(MEMBERSHIP_PLANS_MATCHER, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    renderWithProviders(<MembershipPlanPage />);
    expect(
      await screen.findByText(/Error loading membership plans/),
    ).toBeInTheDocument();
  });

  test('renders table with correct headers', async () => {
    renderWithProviders(<MembershipPlanPage />);
    const table = await screen.findByRole('table');
    const headers = within(table).getAllByRole('columnheader');
    expect(headers).toHaveLength(4);
    expect(headers[0]).toHaveTextContent('Name');
    expect(headers[1]).toHaveTextContent('Duration (months)');
    expect(headers[2]).toHaveTextContent('Price');
    expect(headers[3]).toHaveTextContent('Actions');
  });

  test('renders membership plan data correctly in table rows', async () => {
    renderWithProviders(<MembershipPlanPage />);
    const table = await screen.findByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(4); // 1 header row + 3 data rows

    const firstDataRow = rows[1];
    expect(within(firstDataRow).getByText('Basic Plan')).toBeInTheDocument();
    expect(within(firstDataRow).getByText('1')).toBeInTheDocument();
    expect(within(firstDataRow).getByText('$29.99')).toBeInTheDocument();
  });

  test('opens dialog when Add New Plan button is clicked', async () => {
    const { user } = setup();
    const createButton = await screen.findByRole('button', {
      name: 'Create New Plan',
    });
    await user.click(createButton);
    expect(screen.getByText('Create Membership Plan')).toBeInTheDocument();
  });

  test('opens edit dialog when edit button is clicked', async () => {
    const { user } = setup();
    const editButtons = await screen.findAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);
    expect(screen.getByText('Edit Membership Plan')).toBeInTheDocument();
  });

  test('updates plan and updated plan appears in table', async () => {
    const { user } = setup();
    const editButtons = await screen.findAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[2]); // Annual plan

    const nameInput = screen.getByLabelText('Plan Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Plan');

    const saveButton = screen.getByRole('button', { name: 'Update' });
    await user.click(saveButton);

    await waitFor(() => {
      expect(
        screen.queryByText('Edit Membership Plan'),
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByText('Annual Plan')).not.toBeInTheDocument();
    expect(screen.getByText('Updated Plan')).toBeInTheDocument();
  });

  test('deletes plan when confirmation is accepted', async () => {
    const { user } = setup();
    const deleteButtons = await screen.findAllByRole('button', {
      name: 'Delete',
    });

    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    await user.click(deleteButtons[1]);

    await waitFor(() => {
      expect(screen.queryByText('Premium Plan')).not.toBeInTheDocument();
    });

    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(3); // 1 header row + 2 remaining data rows

    confirmSpy.mockRestore();
  });

  test('does not delete plan when confirmation is canceled', async () => {
    const { user } = setup();
    const deleteButtons = await screen.findAllByRole('button', {
      name: 'Delete',
    });

    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => false);

    await user.click(deleteButtons[0]);

    expect(screen.getByText('Basic Plan')).toBeInTheDocument();

    confirmSpy.mockRestore();
  });
});
