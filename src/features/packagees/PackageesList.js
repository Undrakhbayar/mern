import * as React from "react";
import { useState, useEffect } from "react";
import {
  useGetPackageesQuery,
  useDeletePackageeMutation,
} from "./packageesApiSlice";
import Packagee from "./Packagee";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import MailIcon from "@mui/icons-material/Mail";
import Stack from "@mui/material/Stack";
const PackageesList = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "houseSeq",
      headerName: "№",
      headerClassName: "",
      width: 150,
      editable: true,
    },
    {
      field: "mailId",
      headerName: "Илгээмжийн Дугаар",
      width: 150,
      editable: true,
    },
    {
      field: "blNo",
      headerName: "Тээврийн баримтын дугаар",
      width: 150,
      editable: true,
    },
    {
      field: "netWgt",
      headerName: "Цэвэр жин",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];
  const {
    data: packagees,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPackageesQuery("packageesList", {
    pollingInterval: 150000,
    /*     refetchOnFocus: true,
    refetchOnMountOrArgChange: true, */
  });

  const { username, isManager, isAdmin } = useAuth();

  const navigate = useNavigate();
  const onNewPackageeClicked = () => navigate("/dash/packagees/new");

  const [
    deletePackagee,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeletePackageeMutation();

  useEffect(() => {
    if (isDelSuccess) {
      navigate("/dash/packagees");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onDeletePackageesClicked = async () => {
    await deletePackagee({ id: selected[0]._id });
  };
  let rows = [];
  let selected;
  /*   const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    console.log(selectedRowsData);
    if (selectedRowsData) {
      selected = selectedRowsData[0]._id;
    }
    console.log(selected)
  }; */

  const [selection, setSelection] = useState([]);

  if (isSuccess) {
    const { ids, entities } = packagees;
    rows = Object.values(entities);
    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (packageeId) => entities[packageeId].username === username
      );
    }
  }
  /*   const { packagee } = useGetPackageesQuery("packagee", {
    selectFromResult: ({ data }) => ({
      packagee: selectionModel
    }),
  });

  console.log(packagee); */
  const onSendPackageesClicked = async () => {
    const selectedRowsData = selection.map((id) =>
      rows.find((row) => row.id === id)
    );
    console.log(selectedRowsData);
    let arr = [];

    for (let i = 0; i < selectedRowsData.length; i++) {
      let obj = new Object();
      obj.houseSeq = selectedRowsData[i].id;
      obj.mailId = selectedRowsData[i].mailId;
      arr.push(obj);
    }

    let jsonString = JSON.stringify(arr);
    console.log(jsonString);
    const res = await fetch("https://api.gaali.mn/ceps/send/cargo/short", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonString,
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  const content = (
    <Box sx={{ height: 400, width: "100%" }}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mb: 2 }}
      >
        <Button
          variant="outlined"
          startIcon={<SendIcon />}
          onClick={onSendPackageesClicked}
        >
          Илгээх
        </Button>
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={onDeletePackageesClicked}
        >
          Устгах
        </Button>
        <Button
          variant="contained"
          endIcon={<MailIcon />}
          onClick={onNewPackageeClicked}
        >
          Нэмэх
        </Button>
      </Stack>
      <DataGrid
        sx={{ boxShadow: 2 }}
        rows={rows}
        onSelectionModelChange={setSelection}
        {...rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
      />
    </Box>
  );
  return content;
};
export default PackageesList;
