'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Paper
} from '@mui/material';

// Mock data for demonstration purposes
const mockInstructors = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' },
];

const mockEquipment = [
  'Yoga Mat', 'Dumbbells', 'Resistance Bands', 'Kettlebells', 'Jump Rope', 'Exercise Ball'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CreateClassPage = () => {
  const [classData, setClassData] = useState({
    name: '',
    description: '',
    instructor: '',
    capacity: '',
    duration: '',
    equipment: [],
    startDate: '',
    endDate: '',
    startTime: '',
    daysOfWeek: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setClassData({ ...classData, [name]: value });
  };

  const handleMultiSelectChange = (event) => {
    const { name, value } = event.target;
    setClassData({ ...classData, [name]: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would typically send the classData to your backend API
    console.log('Class data submitted:', classData);
    // Reset form or redirect user after successful submission
  };

  return (
    <Box className="p-4 max-w-2xl mx-auto">
      <Typography variant="h4" component="h1" className="mb-4">
        Create New Class
      </Typography>
      <Paper elevation={3} className="p-6">
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Class Name"
            name="name"
            value={classData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={classData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Instructor</InputLabel>
            <Select
              name="instructor"
              value={classData.instructor}
              onChange={handleInputChange}
              required
            >
              {mockInstructors.map((instructor) => (
                <MenuItem key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Capacity"
            name="capacity"
            type="number"
            value={classData.capacity}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={classData.duration}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="date"
            value={classData.startDate}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="End Date"
            name="endDate"
            type="date"
            value={classData.endDate}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Start Time"
            name="startTime"
            type="time"
            value={classData.startTime}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Days of Week</InputLabel>
            <Select
              multiple
              name="daysOfWeek"
              value={classData.daysOfWeek}
              onChange={handleMultiSelectChange}
              input={<OutlinedInput label="Days of Week" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {daysOfWeek.map((day) => (
                <MenuItem key={day} value={day}>
                  <Checkbox checked={classData.daysOfWeek.indexOf(day) > -1} />
                  <ListItemText primary={day} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className="mt-4"
          >
            Create Class
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateClassPage;