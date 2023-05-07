import * as React from "react";
import { useState, useEffect } from "react";
import { useGetBundlesQuery, useDeleteBundleMutation, useUpdateBundleMutation, useSendBundleMutation } from "./bundlesApiSlice";
import { useGetPackageesQuery } from "../packagees/packageesApiSlice";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Grid, TextField, Button, Stack, InputAdornment, Alert, Typography, FormControl, Modal, Link } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import MailIcon from "@mui/icons-material/Mail";
import EditIcon from "@mui/icons-material/Edit";
import { OrderStatus } from "../../components/Components";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import { useAddNewBundleMutation } from "./bundlesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { CustomInput, CustomFormLabel, style } from "../../components/Components";
import SaveIcon from "@mui/icons-material/Save";
import * as XLSX from "xlsx";

const BundlesList = () => {
  const columns = [
    {
      field: "mailBagNumber",
      headerName: "Богцын дугаар",
      width: 170,
      renderCell: (params) => {
        return <Link href={`/dash/bundles/${params.row.id}`}>{params.row.mailId}</Link>;
      },
    },
    {
      field: "prgsStatusCd",
      headerName: "Төлөв",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: function render({ row }) {
        return <OrderStatus status={row.prgsStatusCd} />;
      },
    },
    {
      field: "actions",
      headerName: "Засах",
      sortable: false,
      type: "actions",
      getActions: ({ row }) => [
        <GridActionsCellItem
          key={1}
          icon={<EditIcon />}
          sx={{ padding: "2px 6px" }}
          label="Засах"
          disabled={row.prgsStatusCd === "11"}
          onClick={() => {
            handleEdit(row.id);
          }}
        />,
        <GridActionsCellItem
          key={2}
          icon={<DeleteIcon />}
          sx={{ padding: "2px 6px" }}
          label="Устгах"
          disabled={row.prgsStatusCd === "11"}
          onClick={() => {
            handleDelete(row);
          }}
        />,
      ],
    },
    {
      field: "delYn",
      headerName: "Төлөв",
      width: 120,
    },
  ];
  const [netWgt, setNetWgt] = useState("");
  const [wgt, setWgt] = useState("");
  const [dangGoodsCode, setDangGoodsCode] = useState("");
  const [transFare, setTransFare] = useState("");
  const [transFareCurr, setTransFareCurr] = useState("");
  const [hsCode, setHsCode] = useState("");

  const handleEdit = (id) => navigate(`/dash/bundles/${id}`);
  const handleDelete = async (id) => {
    await deleteBundle({ id: [id] });
  };
  const {
    data: bundles,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetBundlesQuery("bundlesList", {
    pollingInterval: 1000000,
    /*     refetchOnFocus: true,
    refetchOnMountOrArgChange: true, */
  });
  const {
    data: packagees,
    isLoadingPackagees,
    isSuccess: isSuccessPackagees,
    isErrorPackagees,
    errorPackagees,
  } = useGetPackageesQuery("packageesList", {
    pollingInterval: 1000000,
    /*     refetchOnFocus: true,
    refetchOnMountOrArgChange: true, */
  });

  let content;

  if (isError) {
    content = <Alert severity="error">{error?.data?.message}</Alert>;
  }

  if (isLoading) content = <p>Loading...</p>;
  const { username, isManager, isAdmin } = useAuth();

  const navigate = useNavigate();
  const onNewBundleClicked = () => navigate("/dash/bundles/new");

  const [deleteBundle, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] = useDeleteBundleMutation();
  const [sendBundle, { isSuccess: isSendSuccess, isError: isSendError, error: sendError }] = useSendBundleMutation();

  useEffect(() => {
    if (isDelSuccess) {
      navigate(0);
    }
  }, [isDelSuccess, navigate]);

  const onDeleteBundlesClicked = async () => {
    await deleteBundle({ id: selection });
  };
  const onCopyBundlesClicked = async () => {
    localStorage.setItem("path", "copy");
    navigate(`/dash/bundles/${selection}`);
  };
  let unfiltered = [];
  let rows = [];
  let unfilteredPackagees = [];
  let rowsPackagee = [];
  const [pageSize, setPageSize] = useState(10);
  const [selection, setSelection] = useState([]);

  if (isSuccess) {
    const { entities } = bundles;

    unfiltered = Object.values(entities);
    if (isManager || isAdmin) {
      rows = [...unfiltered];
    } else {
      rows = unfiltered.filter(({ regusername }) => regusername === username);
    }
  }
  console.log(isSuccessPackagees);
  if (isSuccessPackagees) {
    const { entities } = packagees;
    console.log(entities)
    unfilteredPackagees = Object.values(entities);
    if (isManager || isAdmin) {
      rowsPackagee = [...unfilteredPackagees];
    } else {
      rowsPackagee = unfilteredPackagees.filter(({ regusername }) => regusername === username);
    }
  }

  const [prgsStatusCd, setPrgsStatusCd] = useState([]);
  const [updateBundle, { isLoadingU, isSuccessU, isErrorU, errorU }] = useUpdateBundleMutation();

  useEffect(() => {
    if (isSuccessU) {
      setPrgsStatusCd("");
    }
  }, [isSuccessU]);

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  const onSaveBundleClicked = async (data) => {
    await addNewBundle({
      data,
    });
  };
  const [addNewBundle, { isLoading: isILoading, isSuccess: isISuccess, isError: isIErorr, error: Ierror }] = useAddNewBundleMutation();
  useEffect(() => {
    if (isISuccess) {
      console.log("here");
      navigate("/dash/bundles");
    }
  }, [isISuccess, navigate]);

  const fileType = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      // console.log(selectedFile.type);
      let reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.readAsArrayBuffer(selectedFile);

      reader.onload = (e) => {
        //setExcelFileError(null);
        const bstr = e.target.result;
        if (bstr !== null) {
          console.log(bstr);
          const workbook = XLSX.read(bstr, { type: "buffer" });
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          //for (let i = 1; i < data.length; i++) {
          data.shift();
          const finalData = data.map((v) => ({ ...v, user: users[0].id }));
          console.log(finalData);
          onSaveBundleClicked(finalData);
          //}
        } else {
          alert("error!");
        }
      };
    } else {
      console.log("plz select your file");
    }
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  content = (
    <Box sx={{ height: 400, width: "100%" }}>
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 1 }}>
        <input type="file" onChange={handleFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"></input>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={onDeleteBundlesClicked}
          size="small"
          sx={{
            bgcolor: "#6366F1",
            ":hover": { bgcolor: "#4338CA" },
          }}
        >
          Устгах
        </Button>
        <Button
          sx={{
            bgcolor: "#6366F1",
            ":hover": { bgcolor: "#4338CA" },
          }}
          variant="contained"
          endIcon={<SaveIcon />}
          onClick={handleOpen}
          size="small"
        >
          Нэмэх
        </Button>
      </Stack>
      {isDelError ? <Alert severity="error">{delerror?.data?.message}</Alert> : <></>}
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
          experimentalFeatures={{ newEditingApi: true }}
          density="compact"
          localeText={{
            columnMenuFilter: "Шүүх",
            columnMenuHideColumn: "Hide column",
            columnMenuUnsort: "Unsort",
            columnMenuSortAsc: "Sort by ASC",
            columnMenuSortDesc: "Sort by DESC",
            toolbarDensity: "Хэмжээ",
            toolbarDensityLabel: "Size",
            toolbarDensityCompact: "Жижиг",
            toolbarDensityStandard: "Дунд",
            toolbarDensityComfortable: "Том",
          }}
          components={{
            Toolbar: GridToolbar,
          }}
          getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
          initialState={{ pinnedColumns: { left: ["houseSeq"], right: ["actions"] } }}
        />
      </div>
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ m: 1 }}>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style}>
            <Paper variant="outlined">
              <Grid container columns={11}>
                <Grid item xs={11}>
                  <Typography variant="h6" m={2}>
                    Барааны мэдээлэл
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <FormControl>
                    <CustomFormLabel name="Цэвэр жин" />
                    <CustomInput
                      value={netWgt}
                      onChange={(e) => {
                        setNetWgt(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">KG</InputAdornment>,
                      }}
                    />
                    <CustomFormLabel name="Бохир жин" />
                    <CustomInput
                      value={wgt}
                      onChange={(e) => {
                        setWgt(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">KG</InputAdornment>,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <Stack>
                    <CustomFormLabel name="Тээврийн зардал үнэ" />
                    <CustomInput
                      value={transFare}
                      onChange={(e) => {
                        setTransFare(e.target.value);
                      }}
                    />
                    <CustomFormLabel name="Тээврийн зардал валют" />
                    <CustomInput
                      value={transFareCurr}
                      onChange={(e) => {
                        setTransFareCurr(e.target.value);
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={5}>
                  <Stack>
                    <CustomFormLabel name="БТКУС код" />
                    <CustomInput
                      value={hsCode}
                      onChange={(e) => {
                        setHsCode(e.target.value);
                      }}
                    />
                    <CustomFormLabel name="Аюултай барааны код" />
                    <CustomInput
                      value={dangGoodsCode}
                      onChange={(e) => {
                        setDangGoodsCode(e.target.value);
                      }}
                    />
                  </Stack>
                </Grid>
              </Grid>
              <Grid item xs={11}>
                <div style={{ height: 600 }}>
                  <DataGrid
                    sx={{ boxShadow: 2, bgcolor: "#fff" }}
                    rows={rowsPackagee}
                    onRowSelectionModelChange={setSelection}
                    {...rowsPackagee}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 30]}
                    checkboxSelection
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                    density="compact"
                    getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
                    initialState={{ pinnedColumns: { left: ["houseSeq"], right: ["actions"] } }}
                  />
                </div>
              </Grid>
            </Paper>
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 2 }}>
              <Button
                sx={{
                  bgcolor: "#6366F1",
                  ":hover": { bgcolor: "#4338CA" },
                }}
                variant="contained"
                endIcon={<SaveIcon />}
                size="small"
                onClick={onSaveBundleClicked}
              >
                Хадгалах
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Stack>
    </Box>
  );
  return content;
};
export default BundlesList;
