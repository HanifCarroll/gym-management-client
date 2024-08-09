'use client';

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from '@/context/snackbar-context';
import { useConfirmPayment, useGetMembers, useInitiatePayment } from '@/hooks';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [ amount, setAmount ] = useState('10');
  const [ memberId, setMemberId ] = useState('');
  const { showSnackbar } = useSnackbar();

  const { data: members = [], isLoading: isMembersLoading } = useGetMembers();

  const initiatePaymentMutation = useInitiatePayment(async (data) => {
    if (!stripe || !elements) {
      throw new Error('Stripe has not loaded');
    }
    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      }
    });
    if (result.error) {
      showSnackbar(result.error.message || 'Payment failed', 'error');
    } else if (result.paymentIntent.status === 'succeeded') {
      confirmPaymentMutation.mutate(data.paymentIntentId);
    }
  });

  const confirmPaymentMutation = useConfirmPayment(() => {
    setAmount('');
    setMemberId('');
    elements?.getElement(CardElement)?.clear();
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      showSnackbar('Stripe has not loaded', 'error');
      return;
    }
    if (!memberId) {
      showSnackbar('Please select a Member', 'error');
      return;
    }
    initiatePaymentMutation.mutate({
      amount: Math.round(parseFloat(amount) * 100), // Convert to cents
      memberId: memberId
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
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
        <Box sx={{ mb: 2, mt: 2 }}>
          <CardElement options={{ style: { base: { fontSize: '16px' } }, hidePostalCode: true }}/>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!stripe || initiatePaymentMutation.isPending || confirmPaymentMutation.isPending || isMembersLoading}
        >
          {initiatePaymentMutation.isPending || confirmPaymentMutation.isPending ?
            <CircularProgress size={24}/> : 'Pay'}
        </Button>
      </form>
    </Paper>
  );
};

const PaymentPage = () => {
  const [ stripeLoaded, setStripeLoaded ] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setStripeLoaded(true);
    } else {
      console.error('Stripe publishable key is not set in environment variables');
      showSnackbar('Stripe configuration is missing. Please check your environment variables.', 'error');
    }
  }, [ showSnackbar ]);

  if (!stripeLoaded) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error" sx={{ mt: 4 }}>
          Error: Stripe configuration is missing. Please check your environment variables.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        One-Time Payment
      </Typography>
      <Elements stripe={stripePromise}>
        <PaymentForm/>
      </Elements>
    </Container>
  );
};

export default PaymentPage;