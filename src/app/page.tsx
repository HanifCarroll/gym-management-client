'use client';

import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

export default function Home() {
  // Mock data - replace with actual data fetching logic
  const totalMembers = 250;
  const activeClasses = 15;
  const monthlyRevenue = 15000;

  const upcomingClasses = [
    { id: 1, name: 'Yoga', time: '10:00 AM', instructor: 'Jane Doe' },
    { id: 2, name: 'Spin', time: '11:30 AM', instructor: 'John Smith' },
    { id: 3, name: 'HIIT', time: '2:00 PM', instructor: 'Mike Johnson' },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Members
            </Typography>
            <Typography component="p" variant="h4">
              {totalMembers}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Active Classes
            </Typography>
            <Typography component="p" variant="h4">
              {activeClasses}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Monthly Revenue
            </Typography>
            <Typography component="p" variant="h4">
              ${monthlyRevenue}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Quick Actions
            </Typography>
            <Button variant="contained" color="primary" sx={{ mb: 1 }}>
              Add Member
            </Button>
            <Button variant="contained" color="secondary">
              Create Class
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Upcoming Classes
            </Typography>
            <List>
              {upcomingClasses.map((cls) => (
                <ListItem key={cls.id}>
                  <ListItemText
                    primary={cls.name}
                    secondary={`${cls.time} - ${cls.instructor}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="New member registration"
                  secondary="John Doe - 5 minutes ago"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Class cancelled"
                  secondary="Spin Class - 30 minutes ago"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Payment received"
                  secondary="Jane Smith - 1 hour ago"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}