'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for demonstration purposes
const mockMembershipData = {
  totalMembers: 500,
  activeMembers: 450,
  newMembersThisMonth: 30,
  churnRate: 2.5,
  membershipTypes: [
    { name: 'Basic', value: 200 },
    { name: 'Premium', value: 150 },
    { name: 'VIP', value: 100 },
  ],
  membershipTrend: [
    { month: 'Jan', members: 400 },
    { month: 'Feb', members: 420 },
    { month: 'Mar', members: 450 },
    { month: 'Apr', members: 480 },
    { month: 'May', members: 500 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MembershipStatsPage: React.FC = () => {
  const [membershipData, setMembershipData] = useState(mockMembershipData);

  useEffect(() => {
    // In a real application, you would fetch membership data from your backend here
    // setMembershipData(fetchedMembershipData);
  }, []);

  const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Membership Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Members" value={membershipData.totalMembers} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Active Members" value={membershipData.activeMembers} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="New Members This Month" value={membershipData.newMembersThisMonth} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Churn Rate" value={`${membershipData.churnRate}%`} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Membership Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={membershipData.membershipTrend}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="members" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Membership Types
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={membershipData.membershipTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {membershipData.membershipTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MembershipStatsPage;