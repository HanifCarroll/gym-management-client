import MembersTable from './members-table';
import { Box, Container, Typography } from '@mui/material';
import { MemberRepository } from '@/core/repositories';
import { MemberService } from '@/core/services';

async function getMembers() {
  const memberRepository = new MemberRepository();
  const memberService = new MemberService(memberRepository);
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
