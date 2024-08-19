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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCheckInPage } from '@/app/(authenticated)/check-in/use-check-in-page';
import { LoadingAnimation } from '@/app/ui/components';
import { CheckIn, Member } from '@/core/entities';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { format, parseISO } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';

const getColumnDefs = (isMobile: boolean): ColDef<CheckIn>[] => [
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
      format(parseISO(params.value), 'HH:mm'),
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
    hide: isMobile,
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
      variant="outlined"
    >
      {members.map((member) => (
        <MenuItem key={member.id} value={member.id}>
          {`${member.firstName} ${member.lastName}`}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const CheckInGrid: React.FC<{ checkIns: CheckIn[]; isMobile: boolean }> = ({
  checkIns,
  isMobile,
}) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  useEffect(() => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  }, [gridApi, isMobile]);

  return (
    <div
      className="ag-theme-alpine"
      data-testid="ag-grid"
      style={{ height: 'calc(100vh - 250px)', width: '100%' }}
    >
      <AgGridReact
        rowData={checkIns}
        rowHeight={50}
        columnDefs={getColumnDefs(isMobile)}
        pagination={true}
        paginationPageSize={20}
        onGridReady={onGridReady}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default function CheckInPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Box sx={{ maxWidth: '100%', margin: 'auto', p: 2 }}>
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
          sx={{ mt: 2, width: '100%' }}
        >
          Check In
        </Button>
      </Box>
      <CheckInGrid checkIns={filteredCheckIns} isMobile={isMobile} />
    </Box>
  );
}
