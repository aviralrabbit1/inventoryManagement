import React from "react";
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import { useNavigate, useLocation } from "react-router-dom"

const drawerWidth = 240

const menuItems = [
  { text: "Dashboard", icon: DashboardIcon, path: "/" },
  { text: "Device Inventory", icon: InventoryIcon, path: "/inventory" },
  { text: "Installation & Training", icon: BuildIcon, path: "/installation" },
  { text: "Service Visits", icon: AssignmentIcon, path: "/service" },
  { text: "AMC/CMC Tracker", icon: DescriptionIcon, path: "/amc" },
  { text: "Alerts & Photos", icon: WarningIcon, path: "/alerts" },
]

const Sidebar = ({ open }) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InventoryIcon color="primary" />
          <Typography variant="h6" noWrap component="div">
            Device CRM
          </Typography>
        </Box>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton selected={location.pathname === item.path} onClick={() => navigate(item.path)}>
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar
