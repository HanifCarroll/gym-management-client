import { checkInPageServer } from '@/app/(authenticated)/check-in/__test__/check-in-page-test-utils';
import {
  CHECK_INS_MATCHER,
  MEMBERS_MATCHER,
  renderWithProviders,
} from '@/app/ui/test-utils';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import CheckInPage from '../page';

beforeAll(() => checkInPageServer.listen());
afterEach(() => checkInPageServer.resetHandlers());
afterAll(() => checkInPageServer.close());

function setup() {
  const user = userEvent.setup();
  const utils = renderWithProviders(<CheckInPage />);

  return {
    user,
    ...utils,
    selectMember: async (memberName: string) => {
      const select = await screen.findByRole('combobox', {
        name: /select member/i,
      });
      await user.click(select);
      await user.click(screen.getByText(memberName));
    },
    clickCheckInButton: async () => {
      await user.click(screen.getByRole('button', { name: 'Check In' }));
    },
  };
}

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
    checkInPageServer.use(
      http.get(MEMBERS_MATCHER, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    renderWithProviders(<CheckInPage />);
    expect(await screen.findByText('An error occurred')).toBeInTheDocument();
  });

  test('renders member select dropdown with correct options', async () => {
    const { user } = setup();
    const select = await screen.findByRole('combobox', {
      name: /select member/i,
    });
    expect(select).toBeInTheDocument();
    await user.click(select);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('updates selected member when an option is chosen', async () => {
    const { selectMember } = setup();
    await selectMember('John Doe');
    const select = screen.getByRole('combobox', { name: /select member/i });
    expect(select).toHaveTextContent('John Doe');
  });

  test('disables check-in button when no member is selected', async () => {
    setup();
    expect(
      await screen.findByRole('button', { name: 'Check In' }),
    ).toBeDisabled();
  });

  test('enables check-in button when a member is selected', async () => {
    const { selectMember } = setup();
    await selectMember('Jane Smith');
    expect(screen.getByRole('button', { name: 'Check In' })).toBeEnabled();
  });

  test('displays warning for inactive members', async () => {
    const { selectMember } = setup();
    await selectMember('Jane Smith');
    expect(
      await screen.findByText('Warning: The selected member is not active.'),
    ).toBeInTheDocument();
  });

  test('performs check-in when button is clicked', async () => {
    const { selectMember, clickCheckInButton } = setup();
    await selectMember('Jane Smith');
    await clickCheckInButton();
    expect(await screen.findByText('Check-in successful!')).toBeInTheDocument();
  });

  test('displays error message after failed check-in', async () => {
    checkInPageServer.use(
      http.post(CHECK_INS_MATCHER, () => {
        return HttpResponse.json(
          { message: 'Check-in failed' },
          { status: 500 },
        );
      }),
    );
    const { selectMember, clickCheckInButton } = setup();
    await selectMember('Jane Smith');
    await clickCheckInButton();
    expect(await screen.findByText('Check-in failed')).toBeInTheDocument();
  });

  test('filters check-ins when a member is selected', async () => {
    const { selectMember } = setup();

    // Get all check-ins before filtering
    const initialGrid = await screen.findByTestId('ag-grid');
    const initialRows = within(initialGrid).getAllByRole('row');

    // Select a specific member
    await selectMember('John Doe');

    // Wait for the grid to update
    await waitFor(() => {
      const updatedGrid = screen.getByTestId('ag-grid');
      const updatedRows = within(updatedGrid).getAllByRole('row');
      expect(updatedRows.length).toBeLessThan(initialRows.length);
    });

    // Verify that all visible check-ins are for John Doe
    const grid = screen.getByTestId('ag-grid');
    const rows = within(grid).getAllByRole('row');
    rows.slice(1).forEach((row) => {
      // Skip header row
      const cells = within(row).getAllByRole('gridcell');
      expect(cells[2].textContent).toBe('John'); // First Name
      expect(cells[3].textContent).toBe('Doe'); // Last Name
    });
  });

  test('displays all check-ins and filters when a member is selected', async () => {
    const { selectMember } = setup();

    // Helper function to get grid rows and their content
    const getGridContent = async () => {
      const grid = screen.getByTestId('ag-grid');
      const rows = within(grid).getAllByRole('row');
      const headerCells = within(rows[0]).getAllByRole('columnheader');
      const firstNameIndex = headerCells.findIndex(
        (cell) => cell.textContent?.trim() === 'First Name',
      );
      const lastNameIndex = headerCells.findIndex(
        (cell) => cell.textContent?.trim() === 'Last Name',
      );

      // Slice skips the header row
      const memberNames = rows.slice(1).map((row) => {
        const cells = within(row).getAllByRole('gridcell');
        return `${cells[firstNameIndex].textContent} ${cells[lastNameIndex].textContent}`;
      });

      return { rows, memberNames };
    };

    // Wait for the initial unfiltered grid to load
    await screen.findByTestId('ag-grid');

    // Get all check-ins in unfiltered state
    const { rows: initialRows, memberNames: unfilteredNames } =
      await getGridContent();
    expect(initialRows.length).toBeGreaterThan(1); // Ensure we have some data

    // Verify that check-ins for different members are present in unfiltered state
    expect(unfilteredNames).toContain('John Doe');
    expect(unfilteredNames).toContain('Jane Smith');

    await selectMember('John Doe');

    // Wait for the grid to update and verify filtering
    await waitFor(async () => {
      const { rows: filteredRows, memberNames: filteredNames } =
        await getGridContent();
      expect(filteredRows.length).toBeLessThan(initialRows.length);
      expect(filteredNames.every((name) => name === 'John Doe')).toBe(true);

      // Verify the number of filtered rows matches John's check-ins in unfiltered state
      const johnDoeCheckInsCount = unfilteredNames.filter(
        (name) => name === 'John Doe',
      ).length;
      expect(filteredRows.length - 1).toBe(johnDoeCheckInsCount); // -1 for header row
    });
  });
});
