'use client';

import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { LoadingAnimation, MembershipPlanDialog } from '@/app/ui/components';
import { useDeleteMembershipPlan, useMembershipPlans } from '@/app/ui/hooks';
import { MembershipPlan } from '@/core/entities';
import React, { useState } from 'react';

const MembershipPlanRow: React.FC<{
  plan: MembershipPlan;
  onEdit: (plan: MembershipPlan) => void;
  onDelete: (id: string) => void;
}> = ({ plan, onEdit, onDelete }) => (
  <TableRow>
    <TableCell>{plan.name}</TableCell>
    <TableCell>{plan.duration}</TableCell>
    <TableCell>${plan.price.toFixed(2)}</TableCell>
    <TableCell>
      <Tooltip title="Edit">
        <IconButton onClick={() => onEdit(plan)} size="small">
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          onClick={() => {
            if (
              confirm(
                'All memberships linked to this plan will be deleted. Are you sure you want to delete this plan?',
              )
            ) {
              onDelete(plan.id);
            }
          }}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </TableCell>
  </TableRow>
);

const MembershipPlanPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const { data: plans = [], isLoading, isError } = useMembershipPlans();
  const deleteMutation = useDeleteMembershipPlan();

  const handleOpenDialog = (plan: MembershipPlan | null = null) => {
    setEditingPlan(plan);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingPlan(null);
    setOpenDialog(false);
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return (
      <Typography color="error">Error loading membership plans</Typography>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Membership Plans
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Create New Plan
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Duration (months)</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans
              .sort((a, b) => a.duration - b.duration)
              .map((plan) => (
                <MembershipPlanRow
                  key={plan.id}
                  plan={plan}
                  onEdit={handleOpenDialog}
                  onDelete={deleteMutation.mutate}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openDialog ? (
        <MembershipPlanDialog
          open={openDialog}
          onClose={handleCloseDialog}
          plan={editingPlan}
        />
      ) : null}
    </Container>
  );
};

export default MembershipPlanPage;
