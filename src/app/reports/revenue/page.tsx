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
  Card,
  CardContent,
} from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for demonstration purposes
const mockRevenueData = {
  totalRevenue: 150000,
  revenueGrowth: 8.5,
  averageRevenuePerMember: 300,
  revenueBySource: [
    { name: 'Memberships', value: 100000 },
    { name: 'Classes', value: 30000 },
    { name: 'Personal Training', value: 15000 },
    { name: 'Merchandise', value: 5000 },
  ],
  revenueOverTime: [
    { month: 'Jan', revenue: 120000 },
    { month: 'Feb', revenue: 125000 },
    { month: 'Mar', revenue: 135000 },
    { month: 'Apr', revenue: 140000 },
    { month: 'May', revenue: 150000 },
  ],
  topSellingItems: [
    { id: 1, name: 'Annual Membership', quantity: 50, revenue: 50000 },
    { id: 2, name: 'Monthly Membership', quantity: 200, revenue: 40000 },
    { id: 3, name: 'Personal Training Session', quantity: 100, revenue: 10000 },
    { id: 4, name: 'Yoga Class Pack', quantity: 80, revenue: 8000 },
    { id: 5, name: 'Protein Shakes', quantity: 500, revenue: 2500 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RevenuePage: React.FC = () => {
  const [revenueData, setRevenueData] = useState(mockRevenueData);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    // In a real application, you would fetch revenue data from your backend here
    // setRevenueData(fetchedRevenueData);
  }, [timeRange]);

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as string);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const StatCard: React.FC<{ title: string; value: string; subtext?: string }> = ({ title, value, subtext }) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        {subtext && (
          <Typography variant="body2" color="textSecondary">
            {subtext}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs>
          <Typography variant="h4">
            Revenue Overview
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
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(revenueData.totalRevenue)}
            subtext={`${revenueData.revenueGrowth}% growth`}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Average Revenue per Member"
            value={formatCurrency(revenueData.averageRevenuePerMember)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Top Revenue Source"
            value={revenueData.revenueBySource[0].name}
            subtext={formatCurrency(revenueData.revenueBySource[0].value)}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={revenueData.revenueOverTime}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenue by Source
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData.revenueBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueData.revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Selling Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell align="right">Quantity Sold</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueData.topSellingItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.revenue)}</TableCell>
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

export default RevenuePage;