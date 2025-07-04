import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Box, Badge } from "@mui/material"
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material"
// import LightModeIcon from '@mui/icons-material/LightMode';
// import {Brightness4Icon as DarkModeIcon} from '@mui/icons-material/Brightness4';
const Header = ({ onMenuClick, darkMode, onThemeToggle }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>        
        <IconButton color="inherit" aria-label="open drawer" onClick={onMenuClick} edge="start" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Inventory Management
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit" onClick={onThemeToggle}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header