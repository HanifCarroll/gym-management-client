import { CheckIn } from '../entities';

export interface CheckInRepository {
  createCheckIn(memberId: string): Promise<CheckIn>;

  getCheckIns(): Promise<CheckIn[]>;

  getCheckInsByMemberId(memberId: string): Promise<CheckIn[]>;
}
