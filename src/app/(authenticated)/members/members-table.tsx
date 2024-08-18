'use client';

import { deleteMember, updateMember } from './member-actions';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Button,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { Member, MemberStatus, UpdateMemberData } from '@/core/entities';
import React, { useState } from 'react';

interface MembersTableProps {
  initialMembers: Member[];
}

export default function MembersTable({
  initialMembers = [],
}: MembersTableProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
  };

  const handleEditClose = () => {
    setEditingMember(null);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      const result = await deleteMember(id);
      if (result) {
        setMembers(members.filter((member) => member.id !== id));
      } else {
        console.error('Failed to delete member');
      }
    }
  };

  const handleUpdateMember = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!editingMember) return;

    const formData = new FormData(event.currentTarget);
    const memberData: UpdateMemberData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as MemberStatus,
    };

    const updatedMember = await updateMember(editingMember.id, memberData);
    if (updatedMember) {
      setMembers(
        members.map((member) =>
          member.id === updatedMember.id ? updatedMember : member,
        ),
      );
      handleEditClose();
    } else {
      console.error('Failed to update member');
    }
  };

  return (
    <>
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

      <Dialog open={!!editingMember} onClose={handleEditClose}>
        <DialogTitle>Edit Member</DialogTitle>
        <form onSubmit={handleUpdateMember}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="firstName"
              label="First Name"
              type="text"
              fullWidth
              defaultValue={editingMember?.firstName || ''}
            />
            <TextField
              margin="dense"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              defaultValue={editingMember?.lastName || ''}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              defaultValue={editingMember?.email || ''}
            />
            <TextField
              margin="dense"
              name="phone"
              label="Phone"
              type="tel"
              fullWidth
              defaultValue={editingMember?.phone || ''}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                defaultValue={editingMember?.status || 'Active'}
                label="Status"
                variant="standard"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button type="submit">Update</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
