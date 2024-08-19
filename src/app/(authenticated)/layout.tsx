'use client';

import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LoadingAnimation } from '@/app/ui/components/loading-animation';
import Sidenav from '@/app/ui/components/sidenav/sidenav';
import { useAuth } from '@/app/ui/context/auth-context';
import React, { useState } from 'react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!isAuthenticated) {
    return <LoadingAnimation />;
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}
    >
      {isMobile ? (
        <AppBar position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Gym Management
            </Typography>
          </Toolbar>
        </AppBar>
      ) : null}
      <Sidenav
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />
      <main style={{ flexGrow: 1, padding: '20px' }}>{children}</main>
    </div>
  );
}
