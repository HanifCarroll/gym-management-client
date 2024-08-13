import {
  CreateMemberData,
  Member,
  MemberStatus,
  UpdateMemberData,
} from '../entities';

export interface MemberService {
  getMembers(): Promise<Member[]>;

  getMember(id: string): Promise<Member | null>;

  createMember(memberData: CreateMemberData): Promise<Member>;

  updateMember(
    id: string,
    memberData: UpdateMemberData,
  ): Promise<Member | null>;

  deleteMember(id: string): Promise<boolean>;

  getMembershipStatus(memberId: string): Promise<MemberStatus>;

  updateMembershipStatus(
    memberId: string,
    status: MemberStatus,
  ): Promise<boolean>;
}
