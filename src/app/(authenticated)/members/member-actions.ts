'use server';

import { Member, UpdateMemberData } from '@/core/entities';
import { ApiMemberRepository } from '@/core/repositories';
import { MemberServiceImpl } from '@/core/services';
import { revalidatePath } from 'next/cache';

const memberRepository = new ApiMemberRepository();
const memberService = new MemberServiceImpl(memberRepository);

export async function updateMember(
  id: string,
  data: UpdateMemberData,
): Promise<Member | null> {
  try {
    const updatedMember = await memberService.updateMember(id, data);
    revalidatePath('/members'); // Revalidate the members page
    return updatedMember;
  } catch (error) {
    console.error('Error updating member:', error);
    return null;
  }
}

export async function deleteMember(id: string): Promise<boolean> {
  try {
    const result = await memberService.deleteMember(id);
    revalidatePath('/members'); // Revalidate the members page
    return result;
  } catch (error) {
    console.error('Error deleting member:', error);
    return false;
  }
}
