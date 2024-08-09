'use client';

import React, { useMemo, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { format, parseISO } from 'date-fns';
import { ColDef } from 'ag-grid-community';
import { CheckIn, useCheckIns, useCreateCheckIn } from '@/hooks/useCheckIns';
import { Member } from '@/types';
import { useGetMembers } from '@/hooks/members/useGetMembers';
import { useSnackbar } from '@/context/snackbar-context';

const MemberSelect: React.FC<{
  selectedMemberId: string;
  onMemberChange: (event: SelectChangeEvent) => void;
  members: Member[];
}> = ({ selectedMemberId, onMemberChange, members }) => (
  <FormControl fullWidth sx={{ mr: 1 }}>
    <InputLabel id="member-select-label">Select Member</InputLabel>
    <Select
      labelId="member-select-label"
      id="member-select"
      value={selectedMemberId}
      label="Select Member"
      onChange={onMemberChange}
    >
      {members.map((member) => (
        <MenuItem key={member.id} value={member.id}>
          {`${member.firstName} ${member.lastName}`}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const CheckInGrid: React.FC<{ checkIns: CheckIn[] }> = ({ checkIns }) => {
  const columnDefs = useMemo<ColDef<CheckIn>[]>(() => [
    {
      field: 'dateTime',
      headerName: 'Date',
      sortable: true,
      filter: true,
      valueFormatter: (params: any) => format(parseISO(params.value), 'yyyy-MM-dd'),
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      field: 'dateTime',
      headerName: 'Time',
      sortable: true,
      filter: true,
      valueFormatter: (params: any) => format(parseISO(params.value), 'HH:mm:ss'),
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      field: 'member.firstName',
      headerName: 'First Name',
      sortable: true,
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      field: 'member.lastName',
      headerName: 'Last Name',
      sortable: true,
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      field: 'member.email',
      headerName: 'Email',
      sortable: true,
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
  ], []);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={checkIns}
        rowHeight={50}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={20}
        onGridReady={(event) => event.api.sizeColumnsToFit()}
      />
    </div>
  );
};
export default function CheckInPage() {
  const [ selectedMemberId, setSelectedMemberId ] = useState('');
  const { data: members = [] } = useGetMembers();
  const { data: checkIns = [], isLoading, isError } = useCheckIns(selectedMemberId);
  const { mutate: checkInMember, isPending: isCheckInPending } = useCreateCheckIn();
  const { showSnackbar } = useSnackbar();

  const handleMemberChange = (event: SelectChangeEvent) => {
    const memberId = event.target.value;
    setSelectedMemberId(memberId);
    const selectedMember = members.find(member => member.id === memberId);
    if (selectedMember && selectedMember.status !== 'Active') {
      showSnackbar('Warning: The selected member is not active.', 'warning');
    }
  };

  const handleCheckIn = () => {
    if (selectedMemberId) {
      checkInMember(selectedMemberId, {
        onSuccess: () => {
          showSnackbar('Check-in successful!', 'success');
        },
        onError: (error) => {
          showSnackbar(`Check-in failed: ${error.message}`, 'error');
        },
      });
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>An error occurred</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>Gym Check-In System</Typography>
      <Box sx={{ mb: 2 }}>
        <MemberSelect
          selectedMemberId={selectedMemberId}
          onMemberChange={handleMemberChange}
          members={members}
        />
        <Button variant="contained" onClick={handleCheckIn} disabled={!selectedMemberId || isCheckInPending}
                sx={{ mt: 2 }}>
          Check In
        </Button>
      </Box>
      <CheckInGrid checkIns={checkIns}/>
    </Box>
  );
}
