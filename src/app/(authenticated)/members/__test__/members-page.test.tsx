import ViewAllMembers from '../page';
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { viewAllMembersPageServer } from '@/app/(authenticated)/members/__test__/members-page-test-utils';
import { MEMBERS_MATCHER, renderWithProviders } from '@/app/ui/test-utils';
import { HttpResponse, http } from 'msw';

beforeAll(() => viewAllMembersPageServer.listen());
afterEach(() => viewAllMembersPageServer.resetHandlers());
afterAll(() => viewAllMembersPageServer.close());

function setup() {
  const user = userEvent.setup();
  const utils = renderWithProviders(<ViewAllMembers />);

  return {
    user,
    ...utils,
  };
}

describe('ViewAllMembers', () => {
  test('renders the page title correctly', async () => {
    renderWithProviders(<ViewAllMembers />);
    expect(await screen.findByText('All Members')).toBeInTheDocument();
  });

  test('displays loading animation when data is being fetched', async () => {
    renderWithProviders(<ViewAllMembers />);
    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message when there is an error fetching data', async () => {
    viewAllMembersPageServer.use(
      http.get(MEMBERS_MATCHER, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    renderWithProviders(<ViewAllMembers />);
    expect(
      await screen.findByText(/Error loading members/),
    ).toBeInTheDocument();
  });

  test('renders table with correct headers', async () => {
    renderWithProviders(<ViewAllMembers />);
    const table = await screen.findByRole('table');
    const headers = within(table).getAllByRole('columnheader');
    expect(headers).toHaveLength(5);
    expect(headers[0]).toHaveTextContent('Name');
    expect(headers[1]).toHaveTextContent('Email');
    expect(headers[2]).toHaveTextContent('Phone');
    expect(headers[3]).toHaveTextContent('Status');
    expect(headers[4]).toHaveTextContent('Actions');
  });

  test('renders member data correctly in table rows', async () => {
    renderWithProviders(<ViewAllMembers />);
    const table = await screen.findByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(3); // 1 header row + 2 data rows

    const firstDataRow = rows[1];
    expect(within(firstDataRow).getByText('John Doe')).toBeInTheDocument();
    expect(
      within(firstDataRow).getByText('john@example.com'),
    ).toBeInTheDocument();
    expect(within(firstDataRow).getByText('1234567890')).toBeInTheDocument();
    expect(within(firstDataRow).getByText('Active')).toBeInTheDocument();
  });

  test('opens edit dialog when edit button is clicked', async () => {
    const { user } = setup();
    const editButtons = await screen.findAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);
    expect(screen.getByText('Edit Member')).toBeInTheDocument();
  });

  test('updates member data in edit dialog', async () => {
    const { user } = setup();
    const editButtons = await screen.findAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);

    const firstNameInput = screen.getByLabelText('First Name');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');

    expect(firstNameInput).toHaveValue('Jane');
  });

  test('updates member', async () => {
    const { user } = setup();
    const editButtons = await screen.findAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);

    const firstNameInput = screen.getByLabelText('First Name');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jim');

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.queryByText('Edit Member')).not.toBeInTheDocument();
    });
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Jim Doe')).toBeInTheDocument();
  });

  test('closes edit dialog when cancel button is clicked', async () => {
    const { user } = setup();

    const editButtons = await screen.findAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    await waitForElementToBeRemoved(() => screen.queryByText('Edit Member'));

    expect(screen.queryByText('Edit Member')).not.toBeInTheDocument();
  });

  test('deletes member when confirmation is accepted', async () => {
    const { user } = setup();
    const deleteButtons = await screen.findAllByRole('button', {
      name: 'Delete',
    });

    const confirmSpy = vi
      .spyOn(window, 'confirm')
      .mockImplementation(() => true);

    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    // Verify that the member is no longer in the list after refetch
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(2); // 1 header row + 1 remaining data row

    confirmSpy.mockRestore();
  });

  test('does not delete member when confirmation is canceled', async () => {
    const { user } = setup();
    const deleteButtons = await screen.findAllByRole('button', {
      name: 'Delete',
    });

    const confirmSpy = vi
      .spyOn(window, 'confirm')
      .mockImplementation(() => false);

    // Now corresponds to Jane Smith since we deleted Jon Doe in previous test.
    await user.click(deleteButtons[0]);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    confirmSpy.mockRestore();
  });
});
