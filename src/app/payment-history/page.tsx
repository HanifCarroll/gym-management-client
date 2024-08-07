'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { Member } from '@/app/members/page';


interface Payment {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  status: string;
}

interface PaymentWithMember extends Payment {
  memberName: string;
}

const fetchPaymentsWithMembers = async (): Promise<PaymentWithMember[]> => {
  const [ paymentsResponse, membersResponse ] = await Promise.all([
    apiClient.get<Payment[]>('payments/history'),
    apiClient.get<Member[]>('members')
  ]);

  const memberMap = new Map(membersResponse.data.map(member => [ member.id, `${member.firstName} ${member.lastName}` ]));

  return paymentsResponse.data.map(payment => ({
    ...payment,
    memberName: memberMap.get(payment.memberId) || 'Unknown Member'
  }));
};

const PaymentHistory: React.FC = () => {
  const { data: rowData, isLoading, error } = useQuery<PaymentWithMember[], Error>({
    queryKey: [ 'paymentsWithMembers' ],
    queryFn: fetchPaymentsWithMembers,
  });

  const columnDefs: ColDef<PaymentWithMember>[] = [
    { field: 'id', headerName: 'Payment ID', filter: 'agTextColumnFilter', sortable: true },
    { field: 'memberName', headerName: 'Member Name', filter: 'agTextColumnFilter', sortable: true },
    {
      field: 'amount',
      headerName: 'Amount',
      filter: 'agNumberColumnFilter',
      sortable: true,
      valueFormatter: (params) => {
        // Convert from cents to dollars.
        const amount = params.value / 100;
        return amount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
    },
    {
      field: 'date',
      headerName: 'Date',
      filter: 'agDateColumnFilter',
      sortable: true,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    { field: 'status', headerName: 'Status', filter: 'agTextColumnFilter', sortable: true },
  ];

  const defaultColDef: ColDef<PaymentWithMember> = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  if (isLoading) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading payments...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">Error loading payments: {error.message}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom component="h1">
          Payment History
        </Typography>
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <div className="ag-theme-material" style={{ height: '100%', width: '100%' }}>
            <AgGridReact<PaymentWithMember>
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={20}
            />
          </div>
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentHistory;