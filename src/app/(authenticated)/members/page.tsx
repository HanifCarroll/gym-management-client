import MembersTable from './members-table';
import { Box, Container, Typography } from '@mui/material';
import { ApiMemberRepository } from '@/core/repositories';
import { MemberServiceImpl } from '@/core/services';

async function getMembers() {
  const memberRepository = new ApiMemberRepository();
  const memberService = new MemberServiceImpl(memberRepository);
  return memberService.getMembers();
}

export default async function ViewAllMembers() {
  const members = await getMembers();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Members
        </Typography>
      </Box>
      <MembersTable initialMembers={members} />
    </Container>
  );
}
