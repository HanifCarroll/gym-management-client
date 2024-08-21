import { CheckIn } from '@/core/entities';
import { CheckInRepository } from '@/core/repositories';

export class CheckInService {
  private checkInRepository: CheckInRepository;

  constructor(checkInRepository: CheckInRepository) {
    this.checkInRepository = checkInRepository;
  }

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
