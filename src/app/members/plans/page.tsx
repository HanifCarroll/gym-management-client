'use client';

import React, { useState } from 'react';
import {
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
import { MembershipPlan } from '@/entities/membership-plan';
import {
  useCreateMembershipPlan,
  useDeleteMembershipPlan,
  useMembershipPlans,
  useUpdateMembershipPlan
} from '@/services';


const MembershipPlans = () => {
  const [ openDialog, setOpenDialog ] = useState<boolean>(false);
  const [ editingPlan, setEditingPlan ] = useState<MembershipPlan | null>(null);
  const { data: membershipPlans = [] } = useMembershipPlans();
  const { mutateAsync: deleteMembershipPlan } = useDeleteMembershipPlan();
  const { mutateAsync: createMembershipPlan } = useCreateMembershipPlan();
  const { mutateAsync: updateMembershipPlan } = useUpdateMembershipPlan();

  const handleOpenDialog = (plan: MembershipPlan | null = null) => {
    setEditingPlan(plan || { membershipPlanId: 0, planName: '', price: 0, duration: '', });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlan(null);
  };

  const handleSave = async () => {
    if (editingPlan?.membershipPlanId) {
      await updateMembershipPlan({ id: editingPlan.membershipPlanId, data: editingPlan })
    } else {
      await createMembershipPlan(editingPlan);
    }
    handleCloseDialog();
  };

  const handleDelete = async (id: number) => {
    await deleteMembershipPlan(id);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1">Membership Plans</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon/>}
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {membershipPlans.map((plan) => (
              <TableRow key={plan.membershipPlanId}>
                <TableCell>{plan.planName}</TableCell>
                <TableCell>${plan.price.toFixed(2)}</TableCell>
                <TableCell>{plan.duration} Days</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(plan)} size="small">
                    <EditIcon/>
                  </IconButton>
                  <IconButton onClick={() => handleDelete(plan.membershipPlanId)} size="small" color="error">
                    <DeleteIcon/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPlan?.membershipPlanId ? 'Edit Membership Plan' : 'Create New Membership Plan'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Plan Name"
            fullWidth
            value={editingPlan?.planName || ''}
            onChange={(e) => setEditingPlan(editingPlan ? { ...editingPlan, planName: e.target.value } : null)}
          />
          <TextField
            margin="dense"
            label="Price"
            fullWidth
            type="number"
            value={editingPlan?.price || ''}
            onChange={(e) => setEditingPlan(editingPlan ? { ...editingPlan, price: parseFloat(e.target.value) } : null)}
          />
          <TextField
            margin="dense"
            label="Duration"
            fullWidth
            value={editingPlan?.duration || ''}
            onChange={(e) => setEditingPlan(editingPlan ? { ...editingPlan, duration: e.target.value } : null)}
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