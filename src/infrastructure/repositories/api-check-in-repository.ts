import { AxiosInstance } from 'axios';
import { CheckIn } from '@/core/entities';
import { CheckInRepository } from '@/core/repositories';
import { CHECK_IN_URL } from '@/infrastructure/api-client';

export class ApiCheckInRepository implements CheckInRepository {
  constructor(private apiClient: AxiosInstance) {}

  async createCheckIn(memberId: string): Promise<CheckIn> {
    const response = await this.apiClient.post<CheckIn>(CHECK_IN_URL, {
      memberId,
    });
    return response.data;
  }

  async getCheckIns(): Promise<CheckIn[]> {
    const response = await this.apiClient.get<CheckIn[]>(
      `${CHECK_IN_URL}/history`,
    );
    return response.data;
  }

  async getCheckInsByMemberId(memberId: string): Promise<CheckIn[]> {
    const response = await this.apiClient.get<CheckIn[]>(
      `${CHECK_IN_URL}/history?memberId=${memberId}`,
    );
    return response.data;
  }
}
