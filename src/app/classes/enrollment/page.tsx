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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

// Define types for our data
interface ClassInstance {
  id: number;
  classId: number;
  date: string;  // Changed to string for simplicity
  enrolledMembers: number[];
}

interface ClassItem {
  id: number;
  name: string;
  instructor: string;
  capacity: number;
  schedule: string;
}

interface Member {
  id: number;
  name: string;
}

// Mock data for demonstration purposes
const mockClasses: ClassItem[] = [
  { id: 1, name: 'Yoga', instructor: 'John Doe', capacity: 20, schedule: 'Mon, Wed, Fri 9:00 AM' },
  { id: 2, name: 'HIIT', instructor: 'Jane Smith', capacity: 15, schedule: 'Tue, Thu 6:00 PM' },
  { id: 3, name: 'Pilates', instructor: 'Mike Johnson', capacity: 12, schedule: 'Mon, Wed, Fri 11:00 AM' },
];

const mockClassInstances: ClassInstance[] = [
  { id: 1, classId: 1, date: '2023-08-01', enrolledMembers: [1, 2, 3] },
  { id: 2, classId: 1, date: '2023-08-03', enrolledMembers: [1, 2] },
  { id: 3, classId: 2, date: '2023-08-02', enrolledMembers: [3, 4] },
];

const mockMembers: Member[] = [
  { id: 1, name: 'Alice Brown' },
  { id: 2, name: 'Bob Wilson' },
  { id: 3, name: 'Charlie Davis' },
  { id: 4, name: 'Diana Evans' },
];

const EnrollmentPage: React.FC = () => {
  const [classInstances, setClassInstances] = useState<ClassInstance[]>(mockClassInstances);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClassInstance, setSelectedClassInstance] = useState<ClassInstance | null>(null);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    // In a real application, you would fetch class instances data from an API here
    // setClassInstances(fetchedClassInstances);
  }, []);

  const handleOpenDialog = (classInstance: ClassInstance) => {
    setSelectedClassInstance(classInstance);
    setSelectedDate(classInstance.date);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClassInstance(null);
    setSelectedMember('');
    setSelectedDate('');
  };

  const handleEnroll = () => {
    if (selectedClassInstance && selectedMember && selectedDate) {
      // In a real application, you would call an API to enroll the member
      setClassInstances(instances => instances.map(instance =>
        instance.id === selectedClassInstance.id
          ? { ...instance, enrolledMembers: [...instance.enrolledMembers, parseInt(selectedMember)] }
          : instance
      ));
      handleCloseDialog();
    }
  };

  const handleMemberChange = (event: SelectChangeEvent<string>) => {
    setSelectedMember(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const getClassDetails = (classId: number) => {
    return mockClasses.find(c => c.id === classId) || { name: 'Unknown', instructor: 'Unknown', capacity: 0 };
  };

  return (
    <Box className="p-4">
      <Typography variant="h4" component="h1" className="mb-4">Class Enrollment</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class Name</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Enrolled</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classInstances.map((instance) => {
              const classDetails = getClassDetails(instance.classId);
              return (
                <TableRow key={instance.id}>
                  <TableCell>{classDetails.name}</TableCell>
                  <TableCell>{classDetails.instructor}</TableCell>
                  <TableCell>{instance.date}</TableCell>
                  <TableCell>{instance.enrolledMembers.length}</TableCell>
                  <TableCell>{classDetails.capacity}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog(instance)}
                      disabled={instance.enrolledMembers.length >= classDetails.capacity}
                    >
                      Enroll
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Enroll Member in {getClassDetails(selectedClassInstance?.classId || 0).name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Member</InputLabel>
            <Select
              value={selectedMember}
              onChange={handleMemberChange}
            >
              {mockMembers.map((member) => (
                <MenuItem key={member.id} value={member.id.toString()}>{member.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Class Date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleEnroll} variant="contained" color="primary">Enroll</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnrollmentPage;