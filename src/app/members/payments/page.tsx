'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

// Mock data for demonstration purposes
const mockPayments = [
  { id: 1, memberId: 101, memberName: 'John Doe', amount: 49.99, date: '2023-08-01', status: 'Completed', plan: 'Premium' },
  { id: 2, memberId: 102, memberName: 'Jane Smith', amount: 29.99, date: '2023-08-02', status: 'Completed', plan: 'Basic' },
  { id: 3, memberId: 103, memberName: 'Alice Johnson', amount: 399.99, date: '2023-08-03', status: 'Pending', plan: 'Annual' },
];

const mockMembers = [
  { id: 101, name: 'John Doe' },
  { id: 102, name: 'Jane Smith' },
  { id: 103, name: 'Alice Johnson' },
];

const mockPlans = [
  { id: 1, name: 'Basic', price: 29.99 },
  { id: 2, name: 'Premium', price: 49.99 },
  { id: 3, name: 'Annual', price: 399.99 },
];

const PaymentsPage = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
    memberId: '',
    amount: '',
    plan: '',
    status: 'Pending',
  });

  useEffect(() => {
    // In a real application, you would fetch payments data from an API here
    // setPayments(fetchedPayments);
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewPayment({ memberId: '', amount: '', plan: '', status: 'Pending' });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPayment({ ...newPayment, [name]: value });
  };

  const handleSavePayment = () => {
    const memberName = mockMembers.find(member => member.id === parseInt(newPayment.memberId))?.name || '';
    const newPaymentRecord = {
      id: Date.now(),
      memberId: parseInt(newPayment.memberId),
      memberName,
      amount: parseFloat(newPayment.amount),
      date: new Date().toISOString().split('T')[0],
      status: newPayment.status,
      plan: newPayment.plan,
    };
    setPayments([...payments, newPaymentRecord]);
    handleCloseDialog();
  };

  const handleRefund = (paymentId) => {
    // In a real application, you would call an API to process the refund
    setPayments(payments.map(payment =>
      payment.id === paymentId ? { ...payment, status: 'Refunded' } : payment
    ));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1">Payments</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Record New Payment
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.memberName}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell>{payment.plan}</TableCell>
                <TableCell>
                  {payment.status === 'Completed' && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleRefund(payment.id)}
                    >
                      Refund
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Record New Payment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Member</InputLabel>
            <Select
              name="memberId"
              value={newPayment.memberId}
              onChange={handleInputChange}
            >
              {mockMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Plan</InputLabel>
            <Select
              name="plan"
              value={newPayment.plan}
              onChange={handleInputChange}
            >
              {mockPlans.map((plan) => (
                <MenuItem key={plan.id} value={plan.name}>{plan.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={newPayment.amount}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newPayment.status}
              onChange={handleInputChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSavePayment} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;