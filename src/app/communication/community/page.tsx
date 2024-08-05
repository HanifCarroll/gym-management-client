'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';

// Mock data for demonstration purposes
const mockPosts = [
  {
    id: 1,
    author: 'John Doe',
    avatar: 'J',
    content: 'Just finished a great workout! Anyone want to join me for a protein shake?',
    timestamp: '2024-08-05T10:30:00Z',
    comments: [
      { id: 1, author: 'Jane Smith', content: 'Count me in!', timestamp: '2024-08-05T10:35:00Z' },
    ],
  },
  {
    id: 2,
    author: 'Mike Johnson',
    avatar: 'M',
    content: 'New yoga class starting next week. Don\'t forget to sign up!',
    timestamp: '2024-08-05T11:00:00Z',
    comments: [],
  },
];

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<typeof mockPosts[0] | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // In a real application, you would fetch posts from your backend here
    // setPosts(fetchedPosts);
  }, []);

  const handleOpenNewPostDialog = () => {
    setIsNewPostDialogOpen(true);
  };

  const handleCloseNewPostDialog = () => {
    setIsNewPostDialogOpen(false);
    setNewPostContent('');
  };

  const handleCreateNewPost = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        author: 'Current User', // In a real app, this would be the logged-in user
        avatar: 'C',
        content: newPostContent,
        timestamp: new Date().toISOString(),
        comments: [],
      };
      setPosts([newPost, ...posts]);
      handleCloseNewPostDialog();
    }
  };

  const handleOpenComments = (post: typeof mockPosts[0]) => {
    setSelectedPost(post);
  };

  const handleCloseComments = () => {
    setSelectedPost(null);
    setNewComment('');
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedPost) {
      const newCommentObj = {
        id: selectedPost.comments.length + 1,
        author: 'Current User', // In a real app, this would be the logged-in user
        content: newComment,
        timestamp: new Date().toISOString(),
      };
      const updatedPost = {
        ...selectedPost,
        comments: [...selectedPost.comments, newCommentObj],
      };
      setPosts(posts.map(post => post.id === selectedPost.id ? updatedPost : post));
      setSelectedPost(updatedPost);
      setNewComment('');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Community Board</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewPostDialog}
        >
          New Post
        </Button>
      </Box>
      <List>
        {posts.map((post) => (
          <Paper key={post.id} elevation={2} sx={{ mb: 2 }}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>{post.avatar}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={post.author}
                secondary={
                  <>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {new Date(post.timestamp).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {post.content}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <Button
                startIcon={<CommentIcon />}
                onClick={() => handleOpenComments(post)}
              >
                Comments ({post.comments.length})
              </Button>
            </Box>
          </Paper>
        ))}
      </List>

      <Dialog open={isNewPostDialogOpen} onClose={handleCloseNewPostDialog}>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="post"
            label="What's on your mind?"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewPostDialog}>Cancel</Button>
          <Button onClick={handleCreateNewPost} variant="contained" color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedPost} onClose={handleCloseComments} maxWidth="sm" fullWidth>
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          {selectedPost && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedPost.content}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {selectedPost.comments.map((comment) => (
                  <ListItem key={comment.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{comment.author[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={comment.author}
                      secondary={
                        <>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {new Date(comment.timestamp).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {comment.content}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', padding: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleAddComment}
            fullWidth
          >
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CommunityPage;