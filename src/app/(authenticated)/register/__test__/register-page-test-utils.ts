import { MEMBERS_MATCHER } from '@/app/ui/test-utils';
import { CreateMemberData, Member } from '@/core/entities';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

export const registerMemberPageServer = setupServer(
  http.post(`${MEMBERS_MATCHER}`, async ({ request }) => {
    const newMember = (await request.json()) as CreateMemberData;
    const createdMember: Member = {
      ...newMember,
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(createdMember, { status: 201 });
  }),
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
  }),
);
