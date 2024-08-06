'use client';

import React, { ChangeEvent, useState } from 'react';
import { Box, Button, Grid, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { useCreateClass, useInstructors } from '@/services';
import { format } from 'date-fns';

interface Instructor {
  id: string;
  name: string;
}

interface FormData {
  instructorId: string;
  className: string;
  description: string;
  maxCapacity: string;
  dayOfWeek: string;
  startDate: Date | null;
  endDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
}

const formatClassData = (formData: FormData) => {
  return {
    className: formData.className,
    dayOfWeek: parseInt(formData.dayOfWeek, 10),
    description: formData.description,
    endDate: format(new Date(formData.endDate ?? ''), 'yyyy-MM-dd'),
    endTime: format(new Date(formData.endTime ?? ''), 'HH:mm:ss'),
    instructorId: formData.instructorId,
    maxCapacity: parseInt(formData.maxCapacity, 10),
    startDate: format(new Date(formData.startDate ?? ''), 'yyyy-MM-dd'),
    startTime: format(new Date(formData.startTime ?? ''), 'HH:mm:ss'),
  };
};

const NewClassForm = () => {
  const [ formData, setFormData ] = useState<FormData>({
    instructorId: '',
    className: '',
    description: '',
    maxCapacity: '',
    dayOfWeek: '',
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
  });
  const { mutateAsync: createClass } = useCreateClass();
  const { data: instructors = [] } = useInstructors();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name: keyof FormData) => (value: Date | null) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);
    await createClass(formatClassData(formData));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Create New Class
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="instructorId"
                label="Instructor"
                value={formData.instructorId}
                onChange={handleChange}
                fullWidth
                required
              >
                {instructors.map((instructor) => (
                  <MenuItem key={instructor.instructorId} value={instructor.instructorId}>
                    {instructor.firstName} {instructor.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="className"
                label="Class Name"
                value={formData.className}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="maxCapacity"
                label="Max Capacity"
                type="number"
                value={formData.maxCapacity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="dayOfWeek"
                label="Day of Week"
                select
                value={formData.dayOfWeek}
                onChange={handleChange}
                fullWidth
                required
              >
                {[ 0, 1, 2, 3, 4, 5, 6 ].map((day) => (
                  <MenuItem key={day} value={day.toString()}>
                    {[ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ][day]}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={handleDateChange('startDate')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={handleDateChange('endDate')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Start Time"
                value={formData.startTime}
                onChange={handleDateChange('startTime')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="End Time"
                value={formData.endTime}
                onChange={handleDateChange('endTime')}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Create Class
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default NewClassForm;
