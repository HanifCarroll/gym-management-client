import { CreateMemberData, Member } from '../entities';

export interface MemberRepository {
  getAll(): Promise<Member[]>;

  getById(id: string): Promise<Member | null>;

  create(member: CreateMemberData): Promise<Member>;

  update(id: string, member: Partial<Member>): Promise<Member>;

  delete(id: string): Promise<Member>;
}
