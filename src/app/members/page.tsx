'use client';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

const fetchMembers = async (): Promise<Member[]> => {
  const { data } = await apiClient.get('members');
  return data;
};

const updateMember = async (member: Member): Promise<Member> => {
  const { data } = await apiClient.patch(`/members/${member.id}`, member);
  return data;
};

const deleteMember = async (id: string): Promise<void> => {
  await apiClient.delete(`members/${id}`);
};

const ViewAllMembers: React.FC = () => {
  const [ editingMember, setEditingMember ] = useState<Member | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [ 'members' ],
    queryFn: fetchMembers,
  });

  const updateMutation = useMutation({
    mutationFn: updateMember,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ 'members' ] });
      setEditingMember(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ 'members' ] });
    },
  });

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingMember(prev => prev ? { ...prev, [name as string]: value } : null);
  };

  const handleEditSubmit = () => {
    if (editingMember) {
      updateMutation.mutate(editingMember);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setEditingMember(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress/>
      </Box>
    );
  }

  if (isError) {
    return (
      <Container>
        <Alert severity="error">
          Error loading members: {(error as Error).message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Members
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="members table">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.firstName}</TableCell>
                <TableCell>{member.lastName}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditClick(member)}>Edit</Button>
                  <Button onClick={() => handleDeleteClick(member.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingMember} onClose={() => setEditingMember(null)}>
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            value={editingMember?.firstName || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            value={editingMember?.lastName || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={editingMember?.email || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            value={editingMember?.phone || ''}
            onChange={handleEditChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={editingMember?.status || ''}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingMember(null)}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewAllMembers;
