import { MEMBERS_MATCHER } from '@/app/ui/test-utils';
import { PAYMENTS_URL } from '@/core/api-client';
import { Member, Payment } from '@/core/entities';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

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
    status: 'Active',
    createdAt: '',
    updatedAt: '',
  },
];

const mockPayments: Payment[] = [
  {
    id: '1',
    memberId: '1',
    amount: 5000, // $50.00
    date: '2023-01-01T10:00:00Z',
    status: 'Successful',
  },
  {
    id: '2',
    memberId: '2',
    amount: 7500, // $75.00
    date: '2023-01-02T11:00:00Z',
    status: 'Successful',
  },
];

export const paymentHistoryPageServer = setupServer(
  http.get(MEMBERS_MATCHER, () => {
    return HttpResponse.json(mockMembers);
  }),
  http.get(`*${PAYMENTS_URL}`, () => {
    return HttpResponse.json(mockPayments);
  }),
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
  }),
);
