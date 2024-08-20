'use client';

import { registerMember } from './register-actions';
import { Box, Button, TextField } from '@mui/material';
import { useSnackbar } from '@/app/ui/hooks';
import { CreateMemberData, Member } from '@/core/entities';
import React, { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

const initialFormData: RegisterMemberState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

export type RegisterMemberState = CreateMemberData & {
  success?: boolean;
  member?: Member;
  error?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      variant="contained"
      color="primary"
      size="large"
    >
      {pending ? 'Submitting...' : 'Submit'}
    </Button>
  );
}

export default function RegisterMemberForm() {
  const [state, formAction] = useFormState(registerMember, initialFormData);
  const { showSnackbar } = useSnackbar();
  const formRef = useRef<HTMLFormElement>(null);
  // Prevents snackbar from staying permanently open.
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      showSnackbar('Member registered successfully!', 'success');
      formRef.current?.reset();
    } else if (state.error && state.error !== prevStateRef.current.error) {
      showSnackbar('An error occurred while registering member.', 'error');
    }
    prevStateRef.current = state;
  }, [state, showSnackbar]);

  return (
    <form ref={formRef} action={formAction}>
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        margin="normal"
        required
      />
      <TextField fullWidth label="Phone" name="phone" margin="normal" />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <SubmitButton />
      </Box>
    </form>
  );
}
