'use client';

import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemButton, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Link from 'next/link';

const Sidebar = () => {
  const [open, setOpen] = React.useState({
    members: false,
    classes: false,
    communication: false,
    reports: false
  });

  const handleClick = (section: keyof typeof open) => {
    setOpen({ ...open, [section]: !open[section] });
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        <ListItem>
          <ListItemButton component={Link} href="/">
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={() => handleClick('members')}>
            <ListItemText primary="Member Management" />
            {open.members ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={open.members} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/members/register">
              <ListItemText primary="Register Member" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/members/profiles">
              <ListItemText primary="Manage Profiles" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/members/plans">
              <ListItemText primary="Membership Plans" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/members/payments">
              <ListItemText primary="Payments" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItem>
          <ListItemButton onClick={() => handleClick('classes')}>
            <ListItemText primary="Class Management" />
            {open.classes ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={open.classes} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/classes/create">
              <ListItemText primary="Create Class" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/classes/schedule">
              <ListItemText primary="Schedule" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/classes/instructors">
              <ListItemText primary="Instructors" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/classes/enrollment">
              <ListItemText primary="Enrollment" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItem>
          <ListItemButton onClick={() => handleClick('communication')}>
            <ListItemText primary="Communication" />
            {open.communication ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={open.communication} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/communication/notifications">
              <ListItemText primary="Notifications" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/communication/messages">
              <ListItemText primary="Messages" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/communication/community">
              <ListItemText primary="Community Board" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItem>
          <ListItemButton onClick={() => handleClick('reports')}>
            <ListItemText primary="Reports & Analytics" />
            {open.reports ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={open.reports} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/reports/membership">
              <ListItemText primary="Membership Stats" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} href="/reports/classes">
              <ListItemText primary="Class Attendance" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;