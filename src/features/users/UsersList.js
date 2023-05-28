import { useGetUsersQuery } from "./usersApiSlice";
import { useState, useEffect } from "react";
import User from "./User";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Link, Alert } from "@mui/material";
import { DataGrid, gridClasses, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { alpha, styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import MailIcon from "@mui/icons-material/Mail";
import EditIcon from "@mui/icons-material/Edit";
import gridDefaultLocaleText from "../../components/LocalTextConstants";
const UsersList = () => {
  const columns = [
    {
      field: "id",
      headerName: "id",
      width: 250,
    },
    {
      field: "username",
      headerName: "Нэр",
      width: 200,
    },
    {
      field: "role",
      headerName: "Эрх",
      width: 300,
    },
  ];
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  const [pageSize, setPageSize] = useState(10);
  const [selection, setSelection] = useState([]);

  let rows = [];

  const navigate = useNavigate();
  const onNewUserClicked = () => navigate("/dash/users/new");

  if (isSuccess) {
    const { ids, entities } = users;
    rows = Object.values(entities);
    //const tableContent = ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    content = (
      <Box sx={{ height: 400, width: "100%" }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            endIcon={<MailIcon />}
            onClick={onNewUserClicked}
            sx={{
              bgcolor: "#6366F1",
              ":hover": { bgcolor: "#4338CA" },
            }}
          >
            Нэмэх
          </Button>
        </Stack>
        <div style={{ height: 400 }}>
          <div style={{ height: 600 }}>
            <DataGrid
              sx={{ boxShadow: 2, bgcolor: "#fff" }}
              rows={rows}
              onRowSelectionModelChange={setSelection}
              {...rows}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[10, 20, 30]}
              checkboxSelection
              disableSelectionOnClick
              density="compact"
              localeText={gridDefaultLocaleText}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </div>
        </div>
      </Box>
    );
  }

  return content;
};
export default UsersList;
