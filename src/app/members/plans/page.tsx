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
  Typography
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Mock data for demonstration purposes
const mockPlans = [
  { id: 1, name: 'Basic', price: 29.99, duration: '1 month', features: ['Access to gym', 'Locker use'] },
  { id: 2, name: 'Premium', price: 49.99, duration: '1 month', features: ['Access to gym', 'Locker use', 'Group classes'] },
  { id: 3, name: 'VIP', price: 99.99, duration: '1 month', features: ['Access to gym', 'Locker use', 'Group classes', 'Personal trainer (4 sessions/month)'] },
];

const MembershipPlans = () => {
  const [plans, setPlans] = useState(mockPlans);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch membership plans from an API here
    // setPlans(fetchedPlans);
  }, []);

  const handleOpenDialog = (plan = null) => {
    setEditingPlan(plan || { name: '', price: '', duration: '', features: [] });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlan(null);
  };

  const handleSave = () => {
    if (editingPlan.id) {
      // Update existing plan
      setPlans(plans.map(plan => plan.id === editingPlan.id ? editingPlan : plan));
    } else {
      // Create new plan
      setPlans([...plans, { ...editingPlan, id: Date.now() }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // In a real application, you would call an API to delete the plan
    setPlans(plans.filter(plan => plan.id !== id));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1">Membership Plans</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Plan
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Features</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>${plan.price}</TableCell>
                <TableCell>{plan.duration}</TableCell>
                <TableCell>
                  <ul className="list-disc pl-4">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(plan)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(plan.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPlan?.id ? 'Edit Membership Plan' : 'Create New Membership Plan'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Plan Name"
            fullWidth
            value={editingPlan?.name || ''}
            onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Price"
            fullWidth
            type="number"
            value={editingPlan?.price || ''}
            onChange={(e) => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})}
          />
          <TextField
            margin="dense"
            label="Duration"
            fullWidth
            value={editingPlan?.duration || ''}
            onChange={(e) => setEditingPlan({...editingPlan, duration: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Features (comma-separated)"
            fullWidth
            multiline
            rows={4}
            value={editingPlan?.features.join(', ') || ''}
            onChange={(e) => setEditingPlan({...editingPlan, features: e.target.value.split(',').map(f => f.trim())})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MembershipPlans;