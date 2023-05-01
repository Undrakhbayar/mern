import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
} from "@mui/material";

import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";

const drawerWidth = 240;

export default function NavBar() {
  //const { isManager, isAdmin } = useAuth();
  const { isAdmin } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  //const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation();
  const [sendLogout, { isSuccess }] = useSendLogoutMutation();
  useEffect(() => {
    if (isSuccess) navigate("/login");
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (pathname.includes("packagee")) {
      console.log("packageehere")
      setSelectedIndex(0);
    } else {
      console.log("otherhere")
      setSelectedIndex(1);
    }
  }, [pathname]);

  const sendHome = () => {
    navigate("/dash/packagees");
    setSelectedIndex(0);
  };

  const navigator = (index) => {
    switch (index) {
      case 0:
        navigate("/dash/packagees");
        break;
      case 1:
        navigate("/dash/users");
        break;
      default:
        navigate("/dash/packagees");
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

  let userMenu = null;
  if (isAdmin) {
    userMenu = (
      <ListItem key={2} disablePadding>
        <ListItemButton {...buttonProps(1)}>
          <ListItemIcon>
            <PersonIcon style={{ color: "#9DA4AE" }} />
          </ListItemIcon>
          <ListItemText primary="Хэрэглэгчийн бүртгэл" />
        </ListItemButton>
      </ListItem>
    );
  }
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar style={{ justifyContent: "flex-end", backgroundColor: "#fff" }}>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <PersonIcon style={{ color: "#6366f1" }} fontSize="large" />
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
        <Box display="flex" alignItems="center" justifyContent="center" color="#fff" padding={1}>
          <HomeIcon sx={{ fontSize: 40 }} onClick={sendHome} />
        </Box>
        <List
          sx={{
            // selected and (selected + hover) states
            "& .Mui-selected, & .Mui-selected:hover": {
              bgcolor: "rgba(255, 255, 255, 0.04)",
              "& .MuiTypography-root": {
                color: "#fff",
              },
              "& .MuiSvgIcon-root": {
                color: "#6366F1 !important",
              },
            },
            // hover states
            "& .MuiListItemButton-root:hover": {
              bgcolor: "rgba(255, 255, 255, 0.04)",
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
          {userMenu}
        </List>
      </Drawer>
    </Box>
  );
}
