'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel, ListItemButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';

// Mock data for demonstration purposes
const mockConversations = [
  { id: 1, name: 'John Doe', lastMessage: 'When is the next yoga class?', avatar: 'J' },
  { id: 2, name: 'All Members', lastMessage: 'Reminder: Gym will be closed for maintenance this Sunday.', avatar: 'A' },
  { id: 3, name: 'Jane Smith', lastMessage: 'Can I reschedule my personal training session?', avatar: 'J' },
];

const mockMessages = {
  1: [
    { id: 1, sender: 'John Doe', content: 'When is the next yoga class?', timestamp: '2024-08-05T10:30:00Z' },
    { id: 2, sender: 'Admin', content: 'The next yoga class is tomorrow at 10 AM.', timestamp: '2024-08-05T10:35:00Z' },
  ],
  2: [
    { id: 1, sender: 'Admin', content: 'Reminder: Gym will be closed for maintenance this Sunday.', timestamp: '2024-08-05T11:00:00Z' },
  ],
  3: [
    { id: 1, sender: 'Jane Smith', content: 'Can I reschedule my personal training session?', timestamp: '2024-08-05T12:15:00Z' },
    { id: 2, sender: 'Admin', content: 'Sure, what time works best for you?', timestamp: '2024-08-05T12:20:00Z' },
  ],
};

// Mock data for potential recipients
const mockRecipients = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' },
  { id: 4, name: 'Sarah Williams' },
  { id: 5, name: 'All Members' },
];

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<typeof mockMessages[keyof typeof mockMessages]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isNewConversationDialogOpen, setIsNewConversationDialogOpen] = useState(false);
  const [newConversationRecipient, setNewConversationRecipient] = useState('');
  const [newConversationMessage, setNewConversationMessage] = useState('');

  useEffect(() => {
    // In a real application, you would fetch conversations from your backend here
    // setConversations(fetchedConversations);
  }, []);

  useEffect(() => {
    if (selectedConversation !== null) {
      // In a real application, you would fetch messages for the selected conversation from your backend here
      setMessages(mockMessages[selectedConversation as keyof typeof mockMessages] || []);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation !== null) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'Admin',
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');

      // Update last message in conversations list
      setConversations(conversations.map(conv =>
        conv.id === selectedConversation ? { ...conv, lastMessage: newMessage } : conv
      ));
    }
  };

  const handleOpenNewConversationDialog = () => {
    setIsNewConversationDialogOpen(true);
  };

  const handleCloseNewConversationDialog = () => {
    setIsNewConversationDialogOpen(false);
    setNewConversationRecipient('');
    setNewConversationMessage('');
  };

  const handleStartNewConversation = () => {
    if (newConversationRecipient && newConversationMessage) {
      const newConversationId = conversations.length + 1;
      const newConversation = {
        id: newConversationId,
        name: newConversationRecipient,
        lastMessage: newConversationMessage,
        avatar: newConversationRecipient[0].toUpperCase(),
      };

      setConversations([...conversations, newConversation]);
      setSelectedConversation(newConversationId);
      setMessages([{
        id: 1,
        sender: 'Admin',
        content: newConversationMessage,
        timestamp: new Date().toISOString(),
      }]);

      handleCloseNewConversationDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, height: 'calc(100vh - 100px)' }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      <Paper sx={{ height: 'calc(100% - 50px)', display: 'flex' }}>
        <Grid container>
          <Grid item xs={4} sx={{ borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
              <Typography variant="h6">Conversations</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenNewConversationDialog}
              >
                New
              </Button>
            </Box>
            <Divider />
            <List sx={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
              {conversations.map((conversation) => (
                <ListItemButton
                  button
                  key={conversation.id}
                  selected={selectedConversation === conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <ListItemAvatar>
                    <Avatar>{conversation.avatar}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={conversation.name}
                    secondary={conversation.lastMessage}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Grid>
          <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {selectedConversation !== null ? (
              <>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'Admin' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          bgcolor: message.sender === 'Admin' ? 'primary.light' : 'background.paper',
                        }}
                      >
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          {new Date(message.timestamp).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
                <Divider />
                <Box sx={{ p: 2, display: 'flex' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    onClick={handleSendMessage}
                    sx={{ ml: 1 }}
                  >
                    Send
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={isNewConversationDialogOpen} onClose={handleCloseNewConversationDialog}>
        <DialogTitle>Start New Conversation</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="recipient-select-label">Recipient</InputLabel>
            <Select
              labelId="recipient-select-label"
              value={newConversationRecipient}
              label="Recipient"
              onChange={(e) => {
                if (typeof e.target.value === 'string') {
                  setNewConversationRecipient(e.target.value)
                }
              }}
            >
              {mockRecipients.map((recipient) => (
                <MenuItem key={recipient.id} value={recipient.name}>{recipient.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Message"
            type="text"
            fullWidth
            variant="outlined"
            value={newConversationMessage}
            onChange={(e) => setNewConversationMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewConversationDialog}>Cancel</Button>
          <Button onClick={handleStartNewConversation} variant="contained" color="primary">
            Start Conversation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MessagesPage;
