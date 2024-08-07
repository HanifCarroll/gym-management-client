'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const drawerWidth = 240;

const Sidenav = () => {
  const pathname = usePathname();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon/>, path: '/' },
    { text: 'Register Member', icon: <PersonAddIcon/>, path: '/register' },
    { text: 'Member List', icon: <PeopleIcon/>, path: '/members' },
    { text: 'Process Payment', icon: <PaymentIcon/>, path: '/payment' },
    { text: 'Payment History', icon: <HistoryIcon/>, path: '/payment-history' },
    { text: 'Membership Plans', icon: <CardMembershipIcon/>, path: '/plans' },
    { text: 'Member Check-in', icon: <HowToRegIcon/>, path: '/check-in' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="div">
            Gym Management
          </Typography>
        </Box>
        <Divider/>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              component={Link}
              href={item.path}
              selected={pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text}/>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidenav;
