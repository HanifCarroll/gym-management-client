import { Box, CircularProgress } from '@mui/material';
import React from 'react';

export const LoadingAnimation = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress/>
  </Box>
);
