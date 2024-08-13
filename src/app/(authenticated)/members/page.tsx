'use client';

import React, { useState } from 'react';
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
  IconButton,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Member, MemberStatus } from '@/core/entities';
import {
  useDeleteMember,
  useGetMembers,
  useUpdateMember,
} from '@/app/ui/hooks';

const ViewAllMembers: React.FC = () => {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { data: members = [], isLoading, isError, error } = useGetMembers();
  const updateMemberMutation = useUpdateMember();
  const deleteMemberMutation = useDeleteMember();

  const handleEditClick = (member: Member) => setEditingMember(member);

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteMemberMutation.mutate(id);
    }
  };

  const handleEditChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<MemberStatus>,
  ) => {
    const { name, value } = e.target;
    setEditingMember((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleEditSubmit = () => {
    if (editingMember) {
      const updatedMember = {
        id: editingMember.id,
        firstName: editingMember.firstName,
        lastName: editingMember.lastName,
        email: editingMember.email,
        phone: editingMember.phone,
        status: editingMember.status,
      };

      updateMemberMutation.mutate(
        { id: editingMember.id, data: updatedMember },
        {
          onSuccess: () => setEditingMember(null),
        },
      );
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} hover>
                <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.status}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleEditClick(member)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => handleDeleteClick(member.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!editingMember}
        onClose={() => setEditingMember(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
            <TextField
              autoFocus
              name="firstName"
              label="First Name"
              fullWidth
              value={editingMember?.firstName || ''}
              onChange={handleEditChange}
            />
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              value={editingMember?.lastName || ''}
              onChange={handleEditChange}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={editingMember?.email || ''}
              onChange={handleEditChange}
            />
            <TextField
              name="phone"
              label="Phone"
              fullWidth
              value={editingMember?.phone || ''}
              onChange={handleEditChange}
            />
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select<MemberStatus>
                labelId="status-label"
                name="status"
                value={editingMember?.status || 'Active'}
                onChange={handleEditChange}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingMember(null)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewAllMembers;
