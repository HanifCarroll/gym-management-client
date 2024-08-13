import { CheckIn } from '../entities';

export interface CheckInService {
  createCheckIn(memberId: string): Promise<CheckIn>;

  getCheckIns(): Promise<CheckIn[]>;

  getCheckInsByMemberId(memberId: string): Promise<CheckIn[]>;
}
