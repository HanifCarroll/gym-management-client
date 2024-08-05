'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Mock data for demonstration purposes
const mockMembers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', plan: 'Premium' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', plan: 'Basic' },
  // Add more mock data as needed
];

const ManageProfiles = () => {
  const [members, setMembers] = useState(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch member data from an API here
    // setMembers(fetchedMembers);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member) => {
    setEditingMember(member);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    // In a real application, you would call an API to delete the member
    setMembers(members.filter((member) => member.id !== id));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMember(null);
  };

  const handleSave = () => {
    // In a real application, you would call an API to update the member
    setMembers(members.map((member) =>
      member.id === editingMember.id ? editingMember : member
    ));
    handleCloseDialog();
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Membership Plan</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.plan}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(member)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(member.id)}
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
                label="Name"
                fullWidth
                value={editingMember.name}
                onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={editingMember.email}
                onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Phone"
                fullWidth
                value={editingMember.phone}
                onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Membership Plan"
                fullWidth
                value={editingMember.plan}
                onChange={(e) => setEditingMember({...editingMember, plan: e.target.value})}
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