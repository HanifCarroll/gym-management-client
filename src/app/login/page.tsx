'use client';

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingAnimation } from '@/app/ui/components';
import { useAuth } from '@/app/ui/context';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const { isAuthenticated, login } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    login();
    const redirect = searchParams.get('redirect');
    if (redirect && redirect !== '/login') {
      router.push(redirect); // Ensure it redirects immediately after login
    } else {
      router.push('/members');
    }
  };

  if (isAuthenticated) {
    return <LoadingAnimation />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center">
            Gym Management Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              InputProps={{ readOnly: true }}
              value={'admin'}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={'password'}
              InputProps={{ readOnly: true }}
            />
            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
