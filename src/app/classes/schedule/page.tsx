'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// Mock data for demonstration purposes
const mockClasses = [
  { id: 1, name: 'Yoga', instructor: 'John Doe', startTime: '09:00', endTime: '10:00', daysOfWeek: [1, 3, 5] },
  { id: 2, name: 'HIIT', instructor: 'Jane Smith', startTime: '18:00', endTime: '19:00', daysOfWeek: [2, 4] },
  { id: 3, name: 'Pilates', instructor: 'Mike Johnson', startTime: '11:00', endTime: '12:00', daysOfWeek: [1, 2, 3, 4, 5] },
  { id: 4, name: 'Zumba', instructor: 'Sarah Williams', startTime: '19:00', endTime: '20:00', daysOfWeek: [1, 3, 5] },
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SchedulePage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const getWeekDates = (date) => {
    const week = [];
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday
    for (let i = 0; i < 7; i++) {
      week.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  const getClassesForDay = (dayIndex) => {
    return mockClasses.filter(cls => cls.daysOfWeek.includes(dayIndex + 1));
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1">Class Schedule</Typography>
        <Box>
          <Button onClick={handlePreviousWeek} startIcon={<ChevronLeft />}>
            Previous Week
          </Button>
          <Button onClick={handleNextWeek} endIcon={<ChevronRight />}>
            Next Week
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              {weekDates.map((date, index) => (
                <TableCell key={index} align="center">
                  <Typography variant="subtitle2">{daysOfWeek[index]}</Typography>
                  <Typography variant="caption">{date.toLocaleDateString()}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 14 }, (_, i) => i + 6).map((hour) => (
              <TableRow key={hour}>
                <TableCell>{`${hour}:00`}</TableCell>
                {weekDates.map((_, dayIndex) => {
                  const classesForDay = getClassesForDay(dayIndex);
                  const classForHour = classesForDay.find(cls => {
                    const [startHour] = cls.startTime.split(':').map(Number);
                    return startHour === hour;
                  });

                  return (
                    <TableCell key={dayIndex} align="center">
                      {classForHour && (
                        <Paper elevation={3} className="p-2">
                          <Typography variant="subtitle2">{classForHour.name}</Typography>
                          <Typography variant="caption">{classForHour.instructor}</Typography>
                          <Typography variant="caption" display="block">
                            {`${classForHour.startTime} - ${classForHour.endTime}`}
                          </Typography>
                        </Paper>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SchedulePage;