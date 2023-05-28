import { useParams } from "react-router-dom";
import EditMailForm from "./EditMailForm";
import { useGetMailsQuery } from "./mailsApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { CircularProgress } from "@mui/material";
import useTitle from "../../hooks/useTitle";

const EditMail = () => {
  useTitle("techMails: Edit Mail");

  const { id } = useParams();

  const { username, isManager, isAdmin } = useAuth();

  const { mail } = useGetMailsQuery("mailsList", {
    selectFromResult: ({ data }) => ({
      mail: data?.entities[id],
    }),
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!mail || !users?.length) return <CircularProgress />;

  if (!isManager && !isAdmin) {
    if (mail.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditMailForm mail={mail} users={users} />;

  return content;
};
export default EditMail;
