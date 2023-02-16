import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  Menu,
  MenuItem,
  CssBaseline,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  IconButton,
} from "@mui/material";

import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const PACKAGEES_REGEX = /^\/dash\/packagees(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const drawerWidth = 240;

export default function NavBar() {
  const { isManager, isAdmin } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/login");
  }, [isSuccess, navigate]);

  const navigator = (index) => {
    if (index == 0) {
      navigate("/dash/packagees");
    } else {
      navigate("/dash/users");
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedIndex, setSelectedIndex] = useState("");
  const buttonProps = (value) => ({
    selected: selectedIndex === value,
    onClick: () => {
      setSelectedIndex(value);
      navigator(value);
    },
  });

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar style={{ justifyContent: "flex-end" }}>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <PersonIcon style={{ color: "white" }} fontSize="large" />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>Хэрэглэгчийн мэдээлэл</MenuItem>
            {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
            <MenuItem onClick={sendLogout}>Гарах</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#1C2536",
            color: "#9DA4AE",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List
          sx={{
            // selected and (selected + hover) states
            "&& .Mui-selected, && .Mui-selected:hover": {
              "&, & .MuiListItemIcon-root": {
                color: "#fff",
              },
            },
            // hover states
            "& .MuiListItemButton-root:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&, & .MuiListItemIcon-root": {
                color: "#fff",
              },
            },
          }}
        >
          <ListItem key={1} disablePadding>
            <ListItemButton {...buttonProps(0)}>
              <ListItemIcon>
                <MailIcon style={{ color: "#9DA4AE" }} />
              </ListItemIcon>
              <ListItemText primary="Шуудангийн бүртгэл" />
            </ListItemButton>
          </ListItem>
          <ListItem key={2} disablePadding>
            <ListItemButton {...buttonProps(1)}>
              <ListItemIcon>
                <PersonIcon style={{ color: "#9DA4AE" }} />
              </ListItemIcon>
              <ListItemText primary="Хэрэглэгчийн бүртгэл" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
