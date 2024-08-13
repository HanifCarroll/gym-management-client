'use client';

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useCheckInPage } from '@/app/(authenticated)/check-in/use-check-in-page';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { LoadingAnimation } from '@/app/ui/components';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { CheckIn, Member } from '@/core/entities';
import 'ag-grid-community/styles/ag-grid.css';
import { AgGridReact } from 'ag-grid-react';
import { format, parseISO } from 'date-fns';
import React from 'react';

const columnDefs: ColDef<CheckIn>[] = [
  {
    field: 'dateTime',
    headerName: 'Date',
    sortable: true,
    filter: true,
    valueFormatter: (params: ValueFormatterParams) =>
      format(parseISO(params.value), 'yyyy-MM-dd'),
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
  {
    field: 'dateTime',
    headerName: 'Time',
    sortable: true,
    filter: true,
    valueFormatter: (params: ValueFormatterParams) =>
      format(parseISO(params.value), 'HH:mm:ss'),
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
  {
    field: 'member.firstName',
    headerName: 'First Name',
    sortable: true,
    filter: true,
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
  {
    field: 'member.lastName',
    headerName: 'Last Name',
    sortable: true,
    filter: true,
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
  {
    field: 'member.email',
    headerName: 'Email',
    sortable: true,
    filter: true,
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
];

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
  return (
    <div
      className="ag-theme-alpine"
      data-testid="ag-grid"
      style={{ height: 400, width: '100%' }}
    >
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
  const {
    checkInMember,
    filteredCheckIns,
    handleMemberChange,
    isCheckInPending,
    isDataLoading,
    isError,
    members,
    selectedMemberId,
  } = useCheckInPage();

  if (isDataLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return <Typography>An error occurred</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Gym Check-In System
      </Typography>
      <Box sx={{ mb: 2 }}>
        <MemberSelect
          selectedMemberId={selectedMemberId}
          onMemberChange={handleMemberChange}
          members={members}
        />
        <Button
          variant="contained"
          onClick={checkInMember}
          disabled={isCheckInPending || !selectedMemberId}
          sx={{ mt: 2 }}
        >
          Check In
        </Button>
      </Box>
      <CheckInGrid checkIns={filteredCheckIns} />
    </Box>
  );
}
