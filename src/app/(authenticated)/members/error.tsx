'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ reset }) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Error
        </Typography>
        <Typography>An error occurred while loading members.</Typography>
        <Button onClick={reset} variant="contained" sx={{ mt: 2 }}>
          Try again
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorBoundary;
