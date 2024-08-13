'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { CreateMemberData, MemberStatus } from '@/core/entities';
import { useRegisterMember } from '@/app/ui/hooks';

const initialFormData: CreateMemberData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  status: 'Active',
};

const RegisterMember: React.FC = () => {
  const [formData, setFormData] = useState<CreateMemberData>(initialFormData);
  const registerMemberMutation = useRegisterMember(() =>
    setFormData(initialFormData),
  );

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<MemberStatus>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    registerMemberMutation.mutate(formData);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 4, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register New Member
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inative">Inactive</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={registerMemberMutation.isPending}
            >
              {registerMemberMutation.isPending
                ? 'Registering...'
                : 'Register Member'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterMember;
