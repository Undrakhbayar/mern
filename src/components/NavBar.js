import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";

import useAuth from "../hooks/useAuth";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import { spacing } from '@mui/system';

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const PACKAGEES_REGEX = /^\/dash\/packagees(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const { isManager, isAdmin } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/login");
  }, [isSuccess, navigate]);

  const onNewNoteClicked = () => navigate("/dash/notes/new");
  const onNewUserClicked = () => navigate("/dash/users/new");
  const onNotesClicked = () => navigate("/dash/notes");
  const onUsersClicked = () => navigate("/dash/users");

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  let newNoteButton = null;
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button
        className="icon-button"
        title="New Note"
        onClick={onNewNoteClicked}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    );
  }

  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className="icon-button"
        title="New User"
        onClick={onNewUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let userButton = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <button className="icon-button" title="Users" onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  const logoutButton = (
    <Button
      variant="contained"
      endIcon={<LogoutIcon />}
      onClick={sendLogout}
    >
      Гарах
    </Button>
  );

  const errClass = isError ? "errmsg" : "offscreen";

  let buttonContent;
  if (isLoading) {
    buttonContent = <p>Logging Out...</p>;
  } else {
    buttonContent = (
      <>
        {/*               {newNoteButton}
              {newUserButton}
              {notesButton} */}
        {userButton}
      </>
    );
  }

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
{/*           <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link> */}
          <Box
            ml={"94%"}
            //margin
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            {logoutButton}
          </Box>
        </div>
        {/* <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}> */}
        <nav className="nav-menu active">
          <ul className="nav-menu-items" onClick={showSidebar}>
            {/*             <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li> */}
            <li className="nav-text">{buttonContent}</li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
