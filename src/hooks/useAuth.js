import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = "Employee";

  if (token) {
    const decoded = jwtDecode(token);
    const { userid, username, roles, compname, compregister, compaddr, comptel } = decoded.UserInfo;
    console.log("decoded=>", decoded.UserInfo)
    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    return { userid, username, roles, status, isManager, isAdmin, compname, compregister, compaddr, comptel };
  }

  return { userid: "", username: "", roles: [], isManager, isAdmin, status };
};
export default useAuth;
