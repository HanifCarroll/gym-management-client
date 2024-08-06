'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import { useCreateMember } from '../../../services';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipPlanId: string;
}

const EMPTY_FORM = {
  address: '',
  email: '',
  firstName: '',
  lastName: '',
  membershipPlanId: '',
  phone: '',
}

export default function RegisterMember() {
  const [ formData, setFormData ] = useState<FormData>({
    firstName: 'Hanif',
    lastName: 'Carroll',
    email: 'hanifcarroll@gmail.com',
    phone: '9412865903',
    address: '2112 Lucky Street',
    membershipPlanId: '1',
  });
  const { mutateAsync: createMember } = useCreateMember();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createMember({ ...formData, membershipPlanId: parseInt(formData.membershipPlanId, 10) });
    setFormData(EMPTY_FORM);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', pt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Register New Member
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Membership Type</InputLabel>
                <Select
                  name="membershipType"
                  value={formData.membershipPlanId}
                  onChange={handleChange}
                  label="Membership Type"
                >
                  <MenuItem value="1">Basic</MenuItem>
                  <MenuItem value="2">Premium</MenuItem>
                  <MenuItem value="3">VIP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Register Member
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}