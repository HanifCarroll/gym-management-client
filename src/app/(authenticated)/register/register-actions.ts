'use server';

import { RegisterMemberState } from '@/app/(authenticated)/register/register-member-form';
import { CreateMemberData } from '@/core/entities';
import { MemberRepository } from '@/core/repositories';
import { MemberService } from '@/core/services';

const memberRepository = new MemberRepository();
const memberService = new MemberService(memberRepository);

export async function registerMember(
  state: RegisterMemberState,
  formData: FormData,
): Promise<RegisterMemberState> {
  const data: CreateMemberData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
  };
  try {
    const newMember = await memberService.createMember(data);
    return { ...data, success: true, member: newMember };
  } catch (error) {
    console.error('Error registering member:', error);
    return { ...data, success: false, error: 'Failed to register member' };
  }
}
