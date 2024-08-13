import { CheckIn } from '@/core/entities';
import { CheckInRepository } from '@/core/repositories';
import { CheckInService } from '@/core/services';

export class CheckInServiceImpl implements CheckInService {
  constructor(private checkInRepository: CheckInRepository) {}

  async createCheckIn(memberId: string): Promise<CheckIn> {
    return this.checkInRepository.createCheckIn(memberId);
  }

  async getCheckIns(): Promise<CheckIn[]> {
    return this.checkInRepository.getCheckIns();
  }

  async getCheckInsByMemberId(memberId: string): Promise<CheckIn[]> {
    return this.checkInRepository.getCheckInsByMemberId(memberId);
  }
}
