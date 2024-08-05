'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for demonstration purposes
const mockAttendanceData = {
  overallAttendance: 85, // percentage
  classesByPopularity: [
    { name: 'Yoga', attendance: 120 },
    { name: 'Spinning', attendance: 100 },
    { name: 'HIIT', attendance: 80 },
    { name: 'Pilates', attendance: 60 },
    { name: 'Zumba', attendance: 40 },
  ],
  attendanceByDayOfWeek: [
    { day: 'Monday', attendance: 150 },
    { day: 'Tuesday', attendance: 120 },
    { day: 'Wednesday', attendance: 180 },
    { day: 'Thursday', attendance: 140 },
    { day: 'Friday', attendance: 160 },
    { day: 'Saturday', attendance: 200 },
    { day: 'Sunday', attendance: 100 },
  ],
  recentClasses: [
    { id: 1, name: 'Morning Yoga', instructor: 'Jane Doe', date: '2024-08-05', attendance: 15, capacity: 20 },
    { id: 2, name: 'Evening Spin', instructor: 'John Smith', date: '2024-08-05', attendance: 18, capacity: 20 },
    { id: 3, name: 'Afternoon HIIT', instructor: 'Mike Johnson', date: '2024-08-04', attendance: 12, capacity: 15 },
    { id: 4, name: 'Lunchtime Pilates', instructor: 'Sarah Williams', date: '2024-08-04', attendance: 10, capacity: 15 },
    { id: 5, name: 'Evening Zumba', instructor: 'Emily Brown', date: '2024-08-03', attendance: 20, capacity: 25 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4560'];

const ClassAttendancePage: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    // In a real application, you would fetch attendance data from your backend here
    // setAttendanceData(fetchedAttendanceData);
  }, [timeRange]);

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as string);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs>
          <Typography variant="h4">
            Class Attendance
          </Typography>
        </Grid>
        <Grid item>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="time-range-select-label">Time Range</InputLabel>
            <Select
              labelId="time-range-select-label"
              id="time-range-select"
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Overall Attendance Rate
            </Typography>
            <Typography variant="h3" align="center" sx={{ my: 3 }}>
              {attendanceData.overallAttendance}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Classes by Popularity
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData.classesByPopularity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="attendance"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {attendanceData.classesByPopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Attendance by Day of Week
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={attendanceData.attendanceByDayOfWeek}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Classes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Class Name</TableCell>
                    <TableCell>Instructor</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Attendance</TableCell>
                    <TableCell align="right">Capacity</TableCell>
                    <TableCell align="right">Attendance Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.recentClasses.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell>{classItem.name}</TableCell>
                      <TableCell>{classItem.instructor}</TableCell>
                      <TableCell>{classItem.date}</TableCell>
                      <TableCell align="right">{classItem.attendance}</TableCell>
                      <TableCell align="right">{classItem.capacity}</TableCell>
                      <TableCell align="right">
                        {((classItem.attendance / classItem.capacity) * 100).toFixed(0)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClassAttendancePage;