import { AxiosInstance } from 'axios';
import { CreateMembershipPlanData, MembershipPlan, UpdateMembershipPlanData } from '@/core/entities';
import { MembershipPlanRepository } from '@/core/repositories';
import { apiClient, MEMBERSHIP_PLANS_URL } from '@/infrastructure/api-client';

export class ApiMembershipPlanRepository implements MembershipPlanRepository {
  private apiClient: AxiosInstance;

  constructor(apiClientInstance: AxiosInstance = apiClient) {
    this.apiClient = apiClientInstance;
  }

  async getAll(): Promise<MembershipPlan[]> {
    const response = await this.apiClient.get<MembershipPlan[]>(MEMBERSHIP_PLANS_URL);
    return response.data;
  }

  async getById(id: string): Promise<MembershipPlan | null> {
    const response = await this.apiClient.get<MembershipPlan>(`${MEMBERSHIP_PLANS_URL}/${id}`);
    return response.data;
  }

  async create(plan: CreateMembershipPlanData): Promise<MembershipPlan> {
    const response = await this.apiClient.post<MembershipPlan>(MEMBERSHIP_PLANS_URL, plan);
    return response.data;
  }

  async update(id: string, plan: UpdateMembershipPlanData): Promise<MembershipPlan> {
    const response = await this.apiClient.patch<MembershipPlan>(`${MEMBERSHIP_PLANS_URL}/${id}`, plan);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.delete(`${MEMBERSHIP_PLANS_URL}/${id}`);
  }
}