import { CreateMembershipPlanData, MembershipPlan, UpdateMembershipPlanData } from '../entities';

export interface MembershipPlanService {
  getAllMembershipPlans(): Promise<MembershipPlan[]>;

  createMembershipPlan(plan: CreateMembershipPlanData): Promise<MembershipPlan>;

  updateMembershipPlan(id: string, plan: UpdateMembershipPlanData): Promise<MembershipPlan>;

  deleteMembershipPlan(id: string): Promise<void>;
}