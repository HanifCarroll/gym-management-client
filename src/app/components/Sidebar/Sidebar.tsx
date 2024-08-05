'use client';

import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemButton, Collapse, ListItemIcon, Box } from '@mui/material';
import { ExpandLess, ExpandMore, ChevronRight } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MessageIcon from '@mui/icons-material/Message';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Link from 'next/link';

type MenuItem = {
  title: string;
  icon: React.ReactNode;
  link?: string;
  children?: { title: string; link: string }[];
};

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    link: '/',
  },
  {
    title: 'Member Management',
    icon: <PeopleIcon />,
    children: [
      { title: 'Register Member', link: '/members/register' },
      { title: 'Manage Profiles', link: '/members/profiles' },
      { title: 'Membership Plans', link: '/members/plans' },
      { title: 'Payments', link: '/members/payments' },
    ],
  },
  {
    title: 'Class Management',
    icon: <FitnessCenterIcon />,
    children: [
      { title: 'Create Class', link: '/classes/create' },
      { title: 'Schedule', link: '/classes/schedule' },
      { title: 'Instructors', link: '/classes/instructors' },
      { title: 'Enrollment', link: '/classes/enrollment' },
    ],
  },
  {
    title: 'Communication',
    icon: <MessageIcon />,
    children: [
      { title: 'Notifications', link: '/communication/notifications' },
      { title: 'Messages', link: '/communication/messages' },
      { title: 'Community Board', link: '/communication/community' },
    ],
  },
  {
    title: 'Reports & Analytics',
    icon: <AssessmentIcon />,
    children: [
      { title: 'Membership Stats', link: '/reports/membership' },
      { title: 'Class Attendance', link: '/reports/classes' },
    ],
  },
];

const Sidebar: React.FC = () => {
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    members: false,
    classes: false,
    communication: false,
    reports: false
  });

  const handleClick = (section: string) => {
    setOpen(prevOpen => ({ ...prevOpen, [section]: !prevOpen[section] }));
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
          bgcolor: 'background.default',
        },
      }}
    >
      <List component="nav" sx={{ pt: 2 }}>
        {menuItems.map((item, index) => (
          <Box key={index}>
            <ListItem disablePadding>
              <ListItemButton
                component={item.children ? 'div' : Link}
                href={item.link || '#'}
                onClick={item.children ? () => handleClick(item.title.toLowerCase().replace(/ & /g, '')) : undefined}
                sx={{
                  bgcolor: open[item.title.toLowerCase().replace(/ & /g, '')] ? 'action.selected' : 'inherit',
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 'medium' }} />
                {item.children && (open[item.title.toLowerCase().replace(/ & /g, '')] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            {item.children && (
              <Collapse in={open[item.title.toLowerCase().replace(/ & /g, '')]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child, childIndex) => (
                    <ListItem key={childIndex} disablePadding>
                      <ListItemButton
                        component={Link}
                        href={child.link}
                        sx={{
                          pl: 4,
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon>
                          <ChevronRight fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={child.title} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
