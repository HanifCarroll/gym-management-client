'use client';

import { Box, Container, Typography } from '@mui/material';
import { LoadingAnimation } from '@/app/ui/components';
import { usePaymentsWithMembers } from '@/app/ui/hooks';
import { PaymentWithMember } from '@/core/entities';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react';
import React from 'react';

const columnDefs: ColDef<PaymentWithMember>[] = [
  {
    field: 'id',
    headerName: 'Payment ID',
    filter: 'agTextColumnFilter',
    sortable: true,
  },
  {
    field: 'memberName',
    headerName: 'Member Name',
    filter: 'agTextColumnFilter',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    filter: 'agNumberColumnFilter',
    sortable: true,
    valueFormatter: (params) => {
      const amount = params.value / 100;
      return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
  {
    field: 'date',
    headerName: 'Date',
    filter: 'agDateColumnFilter',
    sortable: true,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
  },
  {
    field: 'status',
    headerName: 'Status',
    filter: 'agTextColumnFilter',
    sortable: true,
  },
];

const defaultColDef: ColDef<PaymentWithMember> = {
  flex: 1,
  minWidth: 100,
  resizable: true,
};

const PaymentHistory: React.FC = () => {
  const { data: rowData, isLoading, error } = usePaymentsWithMembers();

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        <Typography color="error" variant="h6">
          Error loading payments: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container
        maxWidth={false}
        sx={{ mt: 4, mb: 4, flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Typography variant="h4" gutterBottom component="h1">
          Payment History
        </Typography>
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <div
            className="ag-theme-material"
            style={{ height: '100%', width: '100%' }}
          >
            <AgGridReact<PaymentWithMember>
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={20}
              domLayout="autoHeight"
            />
          </div>
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentHistory;
