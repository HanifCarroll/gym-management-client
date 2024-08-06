'use client';

import React, { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Instructor } from '@/entities/instructor';
import { useCreateInstructor, useDeleteInstructor, useInstructors, useUpdateInstructor } from '@/services';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const EMPTY_FORM = {
  instructorId: 0,
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
}


const InstructorsPage = () => {
  const [ openDialog, setOpenDialog ] = useState(false);
  const [ editingInstructor, setEditingInstructor ] = useState<Instructor | null>(null);
  const { data: instructors = [] } = useInstructors();
  const { mutateAsync: createInstructor } = useCreateInstructor();
  const { mutateAsync: updateInstructor } = useUpdateInstructor();
  const { mutateAsync: deleteInstructor } = useDeleteInstructor();

  const handleOpenDialog = (instructor: Instructor | null = null) => {
    setEditingInstructor(instructor || EMPTY_FORM);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingInstructor(null);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditingInstructor(editingInstructor ? { ...editingInstructor, [name]: value } : null);
  };

  const handleSave = async () => {
    if (editingInstructor?.instructorId === 0) {
      const { instructorId, ...newInstructorWithoutId } = editingInstructor;
      await createInstructor(newInstructorWithoutId);
    }
    if (editingInstructor?.instructorId) {
      await updateInstructor({ id: editingInstructor.instructorId, data: editingInstructor })
    } else {
    }
    handleCloseDialog();
  };

  const handleDelete = async (id: number) => {
    await deleteInstructor(id)
  };

  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1">Instructors</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon/>}
          onClick={() => handleOpenDialog()}
        >
          Add Instructor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instructors.map((instructor) => (
              <TableRow key={instructor.instructorId}>
                <TableCell>{instructor.firstName}</TableCell>
                <TableCell>{instructor.lastName}</TableCell>
                <TableCell>{instructor.email}</TableCell>
                <TableCell>{instructor.phone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(instructor)} size="small">
                    <EditIcon/>
                  </IconButton>
                  <IconButton onClick={() => handleDelete(instructor.instructorId)} size="small" color="error">
                    <DeleteIcon/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingInstructor?.instructorId ? 'Edit Instructor' : 'Add New Instructor'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            value={editingInstructor?.firstName || ''}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            value={editingInstructor?.lastName || ''}
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