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
  DialogTitle,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Mock data for demonstration purposes
const mockInstructors = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', specialties: 'Yoga, Pilates' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', specialties: 'HIIT, Strength Training' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '555-555-5555', specialties: 'Zumba, Dance Fitness' },
];

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState(mockInstructors);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch instructors data from an API here
    // setInstructors(fetchedInstructors);
  }, []);

  const handleOpenDialog = (instructor = null) => {
    setEditingInstructor(instructor || { name: '', email: '', phone: '', specialties: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingInstructor(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditingInstructor({ ...editingInstructor, [name]: value });
  };

  const handleSave = () => {
    if (editingInstructor.id) {
      // Update existing instructor
      setInstructors(instructors.map(instructor =>
        instructor.id === editingInstructor.id ? editingInstructor : instructor
      ));
    } else {
      // Add new instructor
      setInstructors([...instructors, { ...editingInstructor, id: Date.now() }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // In a real application, you would call an API to delete the instructor
    setInstructors(instructors.filter(instructor => instructor.id !== id));
  };

  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1">Instructors</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Instructor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Specialties</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instructors.map((instructor) => (
              <TableRow key={instructor.id}>
                <TableCell>{instructor.name}</TableCell>
                <TableCell>{instructor.email}</TableCell>
                <TableCell>{instructor.phone}</TableCell>
                <TableCell>{instructor.specialties}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(instructor)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(instructor.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingInstructor?.id ? 'Edit Instructor' : 'Add New Instructor'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={editingInstructor?.name || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={editingInstructor?.email || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="tel"
            fullWidth
            value={editingInstructor?.phone || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="specialties"
            label="Specialties"
            type="text"
            fullWidth
            value={editingInstructor?.specialties || ''}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstructorsPage;