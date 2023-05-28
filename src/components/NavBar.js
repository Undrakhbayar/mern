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
  Collapse,
} from "@mui/material";

import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PostAdd from "@mui/icons-material/PostAdd";
import LibraryBooks from "@mui/icons-material/LibraryBooks";
import Apartment from "@mui/icons-material/Apartment";

const drawerWidth = 250;

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
    if (pathname.includes("mail")) {
      setSelectedIndex(0);
      setOpenListMail(true);
    } else if (pathname.includes("bundle")) {
      setSelectedIndex(1);
      setOpenListMail(true);
    } else if (pathname.includes("outer")) {
      setSelectedIndex(2);
      setOpenListMail(true);
    } else if (pathname.includes("branch")) {
      setSelectedIndex(3);
      setOpenListUser(true);
    } else if (pathname.includes("user")) {
      setSelectedIndex(4);
      setOpenListUser(true);
    }
  }, [pathname]);

  const sendHome = () => {
    navigate("/dash/mails");
    setSelectedIndex(0);
  };

  const navigator = (index) => {
    switch (index) {
      case 0:
        navigate("/dash/mails");
        break;
      case 1:
        navigate("/dash/bundles");
        break;
      case 2:
        navigate("/dash/outers");
        break;
      case 3:
        navigate("/dash/branches");
        break;
      case 4:
        navigate("/dash/users");
        break;
      default:
        navigate("/dash/mails");
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

  const [openListMail, setOpenListMail] = React.useState(false);
  const [openListUser, setOpenListUser] = React.useState(false);

  const handleListMail = () => {
    setOpenListMail(!openListMail);
  };
  const handleListUser = () => {
    setOpenListUser(!openListUser);
  };
  let userMenu = null;
  /*   if (isAdmin) {
    userMenu = (
        <ListItemButton onClick={handleListUser}>
          <ListItemIcon>
            <PersonIcon style={{ color: "#9DA4AE" }} />
          </ListItemIcon>
          <ListItemText primary="Байгууллагын бүртгэл" />
        </ListItemButton>
        {openListUser ? <ExpandLess /> : <ExpandMore />}
        <Collapse in={openListUser} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton {...buttonProps(2)} sx={{ pl: 4 }}>
              <ListItemIcon>
                <PostAdd style={{ color: "#9DA4AE" }} />
              </ListItemIcon>
              <ListItemText primary="Салбар" />
            </ListItemButton>
            <ListItemButton {...buttonProps(3)} sx={{ pl: 4 }}>
              <ListItemIcon>
                <LibraryBooks style={{ color: "#9DA4AE" }} />
              </ListItemIcon>
              <ListItemText primary="Хэрэглэгч" />
            </ListItemButton>
          </List>
        </Collapse>
    );
  } */
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
          <ListItemButton onClick={handleListMail}>
            <ListItemIcon>
              <MailIcon style={{ color: "#9DA4AE" }} />
            </ListItemIcon>
            <ListItemText primary="Шуудангийн бүртгэл" />
            {openListMail ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openListMail} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton {...buttonProps(0)} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <PostAdd style={{ color: "#9DA4AE" }} />
                </ListItemIcon>
                <ListItemText primary="Шуудан бүртгэх" />
              </ListItemButton>
              <ListItemButton {...buttonProps(1)} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <LibraryBooks style={{ color: "#9DA4AE" }} />
                </ListItemIcon>
                <ListItemText primary="Богцлох" />
              </ListItemButton>
              <ListItemButton {...buttonProps(2)} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <LibraryBooks style={{ color: "#9DA4AE" }} />
                </ListItemIcon>
                <ListItemText primary="Гадуур дагавар бэлтгэх" />
              </ListItemButton>
            </List>
          </Collapse>
          {/* {userMenu} */}
          <ListItemButton onClick={handleListUser}>
            <ListItemIcon>
              <Apartment style={{ color: "#9DA4AE" }} />
            </ListItemIcon>
            <ListItemText primary="Байгууллагын бүртгэл" />
            {openListUser ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openListUser} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton {...buttonProps(3)} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <HomeIcon style={{ color: "#9DA4AE" }} />
                </ListItemIcon>
                <ListItemText primary="Салбар" />
              </ListItemButton>
              <ListItemButton {...buttonProps(4)} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <PersonIcon style={{ color: "#9DA4AE" }} />
                </ListItemIcon>
                <ListItemText primary="Хэрэглэгч" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </Box>
  );
}
