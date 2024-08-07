'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { apiClient } from '@/utils/api';
import { Member } from '@/app/members/page';

const stripePromise = loadStripe('pk_test_51HensUHC8VMbi1DrbdIpmRK7EOZqemmkVmQqv8GAZ5zQ1cP36RAaqsmMMzG88jiTC3E10LZeUSvmMS2V67u7cjiq005WFXSKCP');

const fetchMembers = async () => {
  const { data } = await apiClient.get<Member[]>('members');
  return data;
};

const initiatePayment = async ({ amount, memberId }: { amount: number; memberId: string }) => {
  const { data } = await apiClient.post('payments/initiate', { amount, memberId });
  return data;
};

const confirmPayment = async (paymentIntentId: string) => {
  const { data } = await apiClient.post(`payments/confirm/${paymentIntentId}`);
  return data;
};


const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [ amount, setAmount ] = useState('10');
  const [ memberId, setMemberId ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ severity, setSeverity ] = useState<'success' | 'error'>('success');
  const queryClient = useQueryClient();

  const { data: members, isLoading: isMembersLoading } = useQuery({
    queryKey: [ 'members' ],
    queryFn: fetchMembers,
  });

  const { mutate: initiatePaymentMutation, isPending: isInitiatePaymentPending } = useMutation({
    mutationFn: initiatePayment,
    onSuccess: async (data) => {
      if (!stripe || !elements) {
        throw new Error('Stripe has not loaded');
      }
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });
      if (result.error) {
        throw result.error;
      }
      // Call the confirm endpoint after successful client-side confirmation
      return confirmMutation(data.paymentIntentId);
    },
    onError: (error: Error) => {
      setMessage(error.message || 'An error occurred during payment initiation');
      setSeverity('error');
    },
  });

  const { mutate: confirmMutation, isPending: isConfirmPaymentPending } = useMutation({
    mutationFn: confirmPayment,
    onSuccess: () => {
      setMessage('Payment successful!');
      setSeverity('success');
      setAmount('');
      setMemberId('');
      elements?.getElement(CardElement)?.clear();
      queryClient.invalidateQueries({ queryKey: [ 'paymentHistory' ] });
    },
    onError: (error: Error) => {
      setMessage('Payment confirmed on Stripe but failed to update our records. Please contact support.');
      setSeverity('error');
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    if (!memberId) {
      setMessage('Please select a Member');
      setSeverity('error');
      return;
    }
    initiatePaymentMutation({
      amount: Math.round(parseFloat(amount) * 100), // Convert to cents
      memberId: memberId
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="member-select-label">Member</InputLabel>
        <Select
          labelId="member-select-label"
          id="member-select"
          value={memberId}
          label="Member"
          onChange={(e) => setMemberId(e.target.value)}
          disabled={isMembersLoading}
        >
          {members?.map((member) => (
            <MenuItem key={member.id} value={member.id}>
              {`${member.firstName} ${member.lastName}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Amount"
        variant="outlined"
        fullWidth
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        margin="normal"
        InputProps={{ startAdornment: '$' }}
      />
      <Box sx={{ mb: 2 }}>
        <CardElement options={{ style: { base: { fontSize: '16px' } }, hidePostalCode: true }}/>
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={!stripe || isInitiatePaymentPending || isMembersLoading}
      >
        {isInitiatePaymentPending ? <CircularProgress size={24}/> : 'Pay'}
      </Button>
      <Snackbar open={!!message} autoHideDuration={6000} onClose={() => setMessage('')}>
        <Alert onClose={() => setMessage('')} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </form>
  );
};

const PaymentPage = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        One-Time Payment
      </Typography>
      <Elements stripe={stripePromise}>
        <PaymentForm/>
      </Elements>
    </Container>
  );
};

export default PaymentPage;