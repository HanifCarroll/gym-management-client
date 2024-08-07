'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { apiClient } from '@/utils/api';

interface MembershipPlan {
  id: string;
  name: string;
  duration: number;
  price: number;
}

const API_URL = 'membership-plans';

const MembershipPlanPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [ openDialog, setOpenDialog ] = React.useState(false);
  const [ editingPlan, setEditingPlan ] = React.useState<MembershipPlan | null>(null);

  const { data: plans, isLoading, isError } = useQuery<MembershipPlan[]>({
    queryKey: [ 'membershipPlans' ],
    queryFn: () => apiClient.get(API_URL).then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (newPlan: Omit<MembershipPlan, 'id'>) => apiClient.post(API_URL, newPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'membershipPlans' ] });
      setOpenDialog(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updatedPlan }: MembershipPlan) => apiClient.patch(`${API_URL}/${id}`, updatedPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'membershipPlans' ] });
      setOpenDialog(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`${API_URL}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'membershipPlans' ] });
    },
  });

  const handleOpenDialog = (plan: MembershipPlan | null = null) => {
    setEditingPlan(plan);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingPlan(null);
    setOpenDialog(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const planData = {
      name: formData.get('name') as string,
      duration: Number(formData.get('duration')),
      price: Number(formData.get('price')),
    };

    if (editingPlan) {
      updateMutation.mutate({ ...planData, id: editingPlan.id });
    } else {
      createMutation.mutate(planData);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error loading membership plans</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Membership Plans
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Add New Plan
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Duration (months)</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans?.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.duration}</TableCell>
                <TableCell>${plan.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(plan)}>Edit</Button>
                  <Button color="error"
                          onClick={() => confirm('All memberships linked to this plan will be deleted.  Are you sure you want to delete this plan? ') ? deleteMutation.mutate(plan.id) : null}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingPlan ? 'Edit Membership Plan' : 'Create Membership Plan'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Plan Name"
              type="text"
              fullWidth
              defaultValue={editingPlan?.name || ''}
            />
            <TextField
              margin="dense"
              name="duration"
              label="Duration (months)"
              type="number"
              fullWidth
              defaultValue={editingPlan?.duration || ''}
            />
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              defaultValue={editingPlan?.price || ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit">{editingPlan ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default MembershipPlanPage;