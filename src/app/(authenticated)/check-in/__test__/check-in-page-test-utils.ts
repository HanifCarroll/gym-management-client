import { MEMBERS_MATCHER } from '@/app/ui/test-utils';
import { CHECK_INS_URL } from '@/core/api-client';
import { CheckIn, Member } from '@/core/entities';
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

export const checkInPageServer = setupServer(
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
