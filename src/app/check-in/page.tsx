'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Typography
} from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { format, parseISO } from 'date-fns';
import { apiClient } from '@/utils/api';
import { Member } from '@/app/members/page';
import { ColDef } from 'ag-grid-community';

interface CheckIn {
  id: string;
  memberId: string;
  dateTime: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const fetchCheckIns = async (memberId?: string): Promise<CheckIn[]> => {
  const response = await apiClient.get<CheckIn[]>(`check-in/history${memberId ? `?memberId=${memberId}` : ''}`);
  return response.data;
};

const createCheckIn = async (memberId: string): Promise<CheckIn> => {
  const response = await apiClient.post<CheckIn>('check-in', { memberId });
  return response.data;
};

export default function CheckInPage() {
  const [ selectedMemberId, setSelectedMemberId ] = useState('');
  const [ openWarning, setOpenWarning ] = useState(false);
  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: [ 'members' ],
    queryFn: async () => {
      const response = await apiClient.get<Member[]>('/members');
      return response.data;
    },
  });

  const { data: checkIns = [], isLoading, isError } = useQuery<CheckIn[], Error>({
    queryKey: [ 'checkIns', selectedMemberId ],
    queryFn: () => fetchCheckIns(selectedMemberId || undefined),
    enabled: true
  });

  const mutation = useMutation<CheckIn, Error, string>({
    mutationFn: createCheckIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'checkIns', selectedMemberId ] });
    },
  });

  const handleMemberChange = (event: SelectChangeEvent) => {
    const memberId = event.target.value;
    setSelectedMemberId(memberId);
    const selectedMember = members.find(member => member.id === memberId);
    if (selectedMember && selectedMember.status !== 'Active') {
      setOpenWarning(true);
    }
  };

  const handleCloseWarning = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenWarning(false);
  };

  const handleCheckIn = () => {
    if (selectedMemberId) {
      mutation.mutate(selectedMemberId);
    }
  };

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
      filter: true, cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      field: 'member.email',
      headerName: 'Email',
      sortable: true,
      filter: true, cellStyle: { display: 'flex', alignItems: 'center' }
    },
  ], []);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>An error occurred</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>Gym Check-In System</Typography>
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth sx={{ mr: 1 }}>
          <InputLabel id="member-select-label">Select Member</InputLabel>
          <Select
            labelId="member-select-label"
            id="member-select"
            value={selectedMemberId}
            label="Select Member"
            onChange={handleMemberChange}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {`${member.firstName} ${member.lastName}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleCheckIn} disabled={!selectedMemberId} sx={{ mt: 2 }}>
          Check In
        </Button>
      </Box>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={checkIns}
          rowHeight={50}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          onGridReady={(event) => event.api.sizeColumnsToFit()}
        />
      </div>
      <Snackbar open={openWarning} autoHideDuration={6000} onClose={handleCloseWarning}>
        <Alert onClose={handleCloseWarning} severity="warning" sx={{ width: '100%' }}>
          Warning: The selected member is not active.
        </Alert>
      </Snackbar>
    </Box>
  );
}