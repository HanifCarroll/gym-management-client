import { AxiosInstance } from 'axios';
import { CheckIn } from '@/core/entities';
import { CheckInRepository } from '@/core/repositories';
import { CHECK_INS_URL } from '@/infrastructure/api-client';

export class ApiCheckInRepository implements CheckInRepository {
  constructor(private apiClient: AxiosInstance) {}

  async createCheckIn(memberId: string): Promise<CheckIn> {
    const response = await this.apiClient.post<CheckIn>(CHECK_INS_URL, {
      memberId,
    });
    return response.data;
  }

  async getCheckIns(): Promise<CheckIn[]> {
    const response = await this.apiClient.get<CheckIn[]>(CHECK_INS_URL);
    return response.data;
  }

  async getCheckInsByMemberId(memberId: string): Promise<CheckIn[]> {
    const response = await this.apiClient.get<CheckIn[]>(
      `${CHECK_INS_URL}?memberId=${memberId}`,
    );
    return response.data;
  }
}
