import { CreateMembershipPlanData, MembershipPlan, UpdateMembershipPlanData } from '../entities';

export interface MembershipPlanRepository {
  getAll(): Promise<MembershipPlan[]>;

  getById(id: string): Promise<MembershipPlan | null>;

  create(plan: CreateMembershipPlanData): Promise<MembershipPlan>;

  update(id: string, plan: UpdateMembershipPlanData): Promise<MembershipPlan>;

  delete(id: string): Promise<void>;
}