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
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Send as SendIcon } from '@mui/icons-material';

interface Notification {
  id: number;
  title: string;
  message: string;
  recipients: string[];
  status: 'Sent' | 'Draft';
  sentAt?: string;
}

const mockNotifications: Notification[] = [
  { id: 1, title: 'New Class Schedule', message: 'Check out our updated class schedule for next month!', recipients: ['All Members'], status: 'Sent', sentAt: '2023-07-30 10:00 AM' },
  { id: 2, title: 'Maintenance Notice', message: 'The pool will be closed for maintenance on August 5th.', recipients: ['Pool Members'], status: 'Sent', sentAt: '2023-07-31 2:00 PM' },
  { id: 3, title: 'Special Offer', message: 'Get 20% off on annual memberships this week!', recipients: ['Prospective Members'], status: 'Draft' },
];

const recipientOptions = ['All Members', 'Active Members', 'Inactive Members', 'Pool Members', 'Gym Members', 'Class Participants', 'Prospective Members'];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [openDialog, setOpenDialog] = useState(false);
  const [newNotification, setNewNotification] = useState<Omit<Notification, 'id' | 'status' | 'sentAt'>>({
    title: '',
    message: '',
    recipients: [],
  });

  useEffect(() => {
    // In a real application, you would fetch notifications data from an API here
    // setNotifications(fetchedNotifications);
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewNotification({ title: '', message: '', recipients: [] });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewNotification({ ...newNotification, [name]: value });
  };

  const handleRecipientsChange = (event: SelectChangeEvent<string[]>) => {
    setNewNotification({ ...newNotification, recipients: event.target.value as string[] });
  };

  const handleCreateNotification = () => {
    const newNotificationWithId: Notification = {
      ...newNotification,
      id: Date.now(),
      status: 'Draft',
    };
    setNotifications([...notifications, newNotificationWithId]);
    handleCloseDialog();
  };

  const handleSendNotification = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id
        ? { ...notification, status: 'Sent', sentAt: new Date().toLocaleString() }
        : notification
    ));
  };

  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1">Notifications</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Create Notification
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Recipients</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Sent At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.title}</TableCell>
                <TableCell>{notification.message}</TableCell>
                <TableCell>
                  {notification.recipients.map((recipient, index) => (
                    <Chip key={index} label={recipient} size="small" className="m-1" />
                  ))}
                </TableCell>
                <TableCell>{notification.status}</TableCell>
                <TableCell>{notification.sentAt || 'N/A'}</TableCell>
                <TableCell>
                  {notification.status === 'Draft' && (
                    <Button
                      startIcon={<SendIcon />}
                      onClick={() => handleSendNotification(notification.id)}
                      color="primary"
                    >
                      Send
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Notification</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={newNotification.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="message"
            label="Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newNotification.message}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Recipients</InputLabel>
            <Select
              multiple
              value={newNotification.recipients}
              onChange={handleRecipientsChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {recipientOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateNotification} variant="contained" color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsPage;