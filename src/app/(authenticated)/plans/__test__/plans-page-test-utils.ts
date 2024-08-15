import { MEMBERSHIP_PLANS_MATCHER } from '@/app/ui/test-utils';
import { MembershipPlan, UpdateMembershipPlanData } from '@/core/entities';
import { MEMBERSHIP_PLANS_URL } from '@/infrastructure/api-client';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

let mockMembershipPlans: MembershipPlan[] = [
  {
    id: '1',
    name: 'Basic Plan',
    duration: 1,
    price: 29.99,
  },
  {
    id: '2',
    name: 'Premium Plan',
    duration: 6,
    price: 149.99,
  },
  {
    id: '3',
    name: 'Annual Plan',
    duration: 12,
    price: 299.99,
  },
];

export const membershipPlanPageServer = setupServer(
  http.get(MEMBERSHIP_PLANS_MATCHER, () => {
    return HttpResponse.json(mockMembershipPlans);
  }),
  http.patch(`*${MEMBERSHIP_PLANS_URL}/:id`, async ({ request, params }) => {
    const updatedPlan = (await request.json()) as UpdateMembershipPlanData;
    const { id } = params;
    const index = mockMembershipPlans.findIndex((plan) => plan.id === id);
    if (index !== -1) {
      mockMembershipPlans[index] = {
        ...mockMembershipPlans[index],
        ...updatedPlan,
      };
      return HttpResponse.json(mockMembershipPlans[index]);
    }
    return HttpResponse.json({ error: 'Plan not found' }, { status: 404 });
  }),
  http.delete(`*${MEMBERSHIP_PLANS_URL}/:id`, ({ params }) => {
    const { id } = params;
    mockMembershipPlans = mockMembershipPlans.filter((plan) => plan.id !== id);
    return HttpResponse.json({
      message: 'Membership plan deleted successfully',
    });
  }),
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
  }),
);
