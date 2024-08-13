import {
  CreateMembershipPlanData,
  MembershipPlan,
  UpdateMembershipPlanData,
} from '@/core/entities';
import { MembershipPlanRepository } from '@/core/repositories';
import { MembershipPlanService } from '@/core/services';
import { ApiMembershipPlanRepository } from '@/infrastructure/repositories';

export class MembershipPlanServiceImpl implements MembershipPlanService {
  private membershipPlanRepository: MembershipPlanRepository;

  constructor(
    membershipPlanRepository: MembershipPlanRepository = new ApiMembershipPlanRepository(),
  ) {
    this.membershipPlanRepository = membershipPlanRepository;
  }

  async getAllMembershipPlans(): Promise<MembershipPlan[]> {
    return this.membershipPlanRepository.getAll();
  }

  async createMembershipPlan(
    plan: CreateMembershipPlanData,
  ): Promise<MembershipPlan> {
    return this.membershipPlanRepository.create(plan);
  }

  async updateMembershipPlan(
    id: string,
    plan: UpdateMembershipPlanData,
  ): Promise<MembershipPlan> {
    return this.membershipPlanRepository.update(id, plan);
  }

  async deleteMembershipPlan(id: string): Promise<void> {
    await this.membershipPlanRepository.delete(id);
  }
}
