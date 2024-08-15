import { MEMBERS_MATCHER } from '@/app/ui/test-utils';
import { MEMBERS_URL } from '@/core/api-client';
import { Member, UpdateMemberData } from '@/core/entities';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

let mockMembers: Member[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    status: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '0987654321',
    status: 'Inactive',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

export const viewAllMembersPageServer = setupServer(
  http.get(MEMBERS_MATCHER, () => {
    return HttpResponse.json(mockMembers);
  }),
  http.patch(`*${MEMBERS_URL}/:id`, async ({ request }) => {
    const updatedMember = (await request.json()) as UpdateMemberData;
    const { firstName } = updatedMember;
    if (!firstName) {
      throw new Error('First name is required for this test');
    }
    mockMembers[0].firstName = firstName;
    return HttpResponse.json(updatedMember);
  }),
  http.delete(`*${MEMBERS_URL}/:id`, ({ params }) => {
    const { id } = params;
    mockMembers = mockMembers.filter((member) => member.id !== id);
    return HttpResponse.json({ message: 'Member deleted successfully' });
  }),
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
  }),
);
