'use client';

import React, { useState } from 'react';
import {
  Button,
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
  TextField
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Member } from '@/entities/member';
import { useDeleteMember, useMembers, useUpdateMember } from '@/services';


const ManageProfiles = () => {
  const [ searchTerm, setSearchTerm ] = useState<string>('');
  const [ openDialog, setOpenDialog ] = useState<boolean>(false);
  const [ editingMember, setEditingMember ] = useState<Member | null>(null);
  const { data: members = [] } = useMembers();
  const { mutateAsync: deleteMember } = useDeleteMember();
  const { mutateAsync: updateMember } = useUpdateMember();


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMembers = members.filter((member) =>
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    await deleteMember(id)
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMember(null);
  };

  const handleSave = async () => {
    if (editingMember) {
      await updateMember({ id: editingMember.memberId, data: editingMember });
      handleCloseDialog();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Member Profiles</h1>
      <TextField
        label="Search Members"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Membership Plan</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.memberId}>
                <TableCell>{member.firstName}</TableCell>
                <TableCell>{member.lastName}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.membershipPlanId}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<EditIcon/>}
                    onClick={() => handleEdit(member)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon/>}
                    onClick={() => handleDelete(member.memberId)}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Member Profile</DialogTitle>
        <DialogContent>
          {editingMember && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="First Name"
                fullWidth
                value={editingMember.firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingMember({
                  ...editingMember,
                  firstName: e.target.value
                })}
              />
              <TextField
                autoFocus
                margin="dense"
                label="Last Name"
                fullWidth
                value={editingMember.lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingMember({
                  ...editingMember,
                  lastName: e.target.value
                })}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={editingMember.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingMember({
                  ...editingMember,
                  email: e.target.value
                })}
              />
              <TextField
                margin="dense"
                label="Phone"
                fullWidth
                value={editingMember.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingMember({
                  ...editingMember,
                  phone: e.target.value
                })}
              />
              <TextField
                margin="dense"
                label="Membership Plan"
                fullWidth
                value={editingMember.membershipPlanId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingMember({
                  ...editingMember,
                  membershipPlanId: parseInt(e.target.value, 10)
                })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageProfiles;