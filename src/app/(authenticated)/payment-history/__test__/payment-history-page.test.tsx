import PaymentHistory from '../page';
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { paymentHistoryPageServer } from '@/app/(authenticated)/payment-history/__test__/payment-history-page-test-utils';
import { renderWithProviders } from '@/app/ui/test-utils';
import { PAYMENTS_URL } from '@/core/api-client';
import { HttpResponse, http } from 'msw';

beforeAll(() => paymentHistoryPageServer.listen());
afterEach(() => paymentHistoryPageServer.resetHandlers());
afterAll(() => paymentHistoryPageServer.close());

describe('PaymentHistory', () => {
  test('renders the page title correctly', async () => {
    renderWithProviders(<PaymentHistory />);
    expect(await screen.findByText('Payment History')).toBeInTheDocument();
  });

  test('displays loading animation when data is being fetched', async () => {
    renderWithProviders(<PaymentHistory />);
    expect(await screen.findByTestId('loading-animation')).toBeInTheDocument();
  });

  test('displays error message when there is an error fetching data', async () => {
    paymentHistoryPageServer.use(
      http.get(`*${PAYMENTS_URL}`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    renderWithProviders(<PaymentHistory />);
    await waitForElementToBeRemoved(
      await screen.findByTestId('loading-animation'),
    );

    expect(
      await screen.findByText(/Error loading payments/),
    ).toBeInTheDocument();
  });

  test('renders AG Grid with correct column definitions', async () => {
    renderWithProviders(<PaymentHistory />);
    await waitFor(() => {
      const headers = screen.getAllByRole('columnheader');
      const expectedHeaders = [
        'Payment ID',
        'Member Name',
        'Amount',
        'Date',
        'Status',
      ];
      expectedHeaders.forEach((header, index) => {
        expect(headers[index]).toHaveTextContent(header);
      });
    });
  });

  test('displays payment data correctly in the grid', async () => {
    renderWithProviders(<PaymentHistory />);
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(3); // 2 data rows + 1 header row

      const cellsRow1 = within(rows[1]).getAllByRole('gridcell');
      expect(cellsRow1[0]).toHaveTextContent('1');
      expect(cellsRow1[1]).toHaveTextContent('John Doe');
      expect(cellsRow1[2]).toHaveTextContent('$50.00');
      expect(cellsRow1[3]).toHaveTextContent('1/1/2023');
      expect(cellsRow1[4]).toHaveTextContent('Successful');

      const cellsRow2 = within(rows[2]).getAllByRole('gridcell');
      expect(cellsRow2[0]).toHaveTextContent('2');
      expect(cellsRow2[1]).toHaveTextContent('Jane Smith');
      expect(cellsRow2[2]).toHaveTextContent('$75.00');
      expect(cellsRow2[3]).toHaveTextContent('1/2/2023');
      expect(cellsRow2[4]).toHaveTextContent('Successful');
    });
  });

  test('formats amount column correctly', async () => {
    renderWithProviders(<PaymentHistory />);
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      const cellsRow1 = within(rows[1]).getAllByRole('gridcell');
      const cellsRow2 = within(rows[2]).getAllByRole('gridcell');
      expect(cellsRow1[2]).toHaveTextContent('$50.00');
      expect(cellsRow2[2]).toHaveTextContent('$75.00');
    });
  });

  test('formats date column correctly', async () => {
    renderWithProviders(<PaymentHistory />);
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      const cellsRow1 = within(rows[1]).getAllByRole('gridcell');
      const cellsRow2 = within(rows[2]).getAllByRole('gridcell');
      expect(cellsRow1[3]).toHaveTextContent('1/1/2023');
      expect(cellsRow2[3]).toHaveTextContent('1/2/2023');
    });
  });
});
