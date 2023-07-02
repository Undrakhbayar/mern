import * as React from "react";
import { useState, useEffect } from "react";
import { useGetBundlesQuery, useDeleteBundleMutation, useUpdateBundleMutation, useAddNewBundleMutation } from "./bundlesApiSlice";
import { useGetBundleItemsQuery, useDeleteBundleItemMutation, useUpdateBundleItemMutation, useAddNewBundleItemMutation } from "./bundleItemsApiSlice";
import { useGetMailsQuery } from "../mails/mailsApiSlice";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Grid, Button, Stack, InputAdornment, Alert, Typography, FormControl, Modal, Link, Snackbar } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GreenRedSwitch, CustomInput, CustomFormLabel, theme, style, OrderStatus, DisabledInput } from "../../components/Components";
import gridDefaultLocaleText from "../../components/LocalTextConstants";
import dayjs from "dayjs";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";

const BundlesList = () => {
  const columns = [
    {
      field: "bundleNo",
      headerName: "Богцын дугаар",
      width: 170,
      renderCell: (params) => {
        return <Link href={`/dash/bundles/${params.row.id}`}>{params.row.bundleNo}</Link>;
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
  const bundleItemColumns = [
    {
      field: "mailNo",
      headerName: "Илгээмжийн дугаар",
      width: 170,
    },
    {
      field: "wgt",
      headerName: "Жин",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Засах",
      sortable: false,
      type: "actions",
      getActions: ({ row }) => [
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
      field: "riskType",
      headerName: "Эрсдлийн төлөв",
      width: 180,
    },
  ];
  const mailColumns = [
    {
      field: "mailId",
      headerName: "Илгээмжийн дугаар",
      width: 170,
    },
    {
      field: "mailWgt",
      headerName: "Жин",
      width: 120,
    },
    {
      field: "riskType",
      headerName: "Эрсдлийн төлөв",
      width: 180,
    },
  ];
  const { userid, username, isManager, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [bundleBranch, setBundleBranch] = useState("");
  const [bundleNo, setBundleNo] = useState("");
  const [bundleWgt, setBundleWgt] = useState("");
  const [bundleDate, setBundleDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [bundleType, setBundleType] = useState("");
  const [innerNo, setInnerNo] = useState("");
  const [sumWgt, setSumWgt] = useState("");
  const [sumCnt, setSumCnt] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selection, setSelection] = useState([]);
  const [selectionMail, setSelectionMail] = useState([]);
  const [rowsBundleItems, setRowsBundleItems] = React.useState("");
  let sumwgt = 0;
  const [open, setOpen] = React.useState(false);
  const [openPackage, setOpenPackage] = React.useState(false);

  const { data: bundles, isFetching, isSuccess, isError, error, refetch } = useGetBundlesQuery("bundlesList", { refetchOnMountOrArgChange: true });
  const {
    data: mails,
    isLoading: isLoadingMails,
    isSuccess: isSuccessMails,
    isError: isErrorMails,
    error: errorMails,
  } = useGetMailsQuery("mailsList", { refetchOnMountOrArgChange: true });
  const {
    data: bundleItems,
    isLoading: isLoadingBundleItems,
    isSuccess: isSuccessBundleItems,
    isError: isErrorBundleItems,
    error: errorBundleItems,
  } = useGetBundleItemsQuery("bundleItemsList", {
    refetchOnMountOrArgChange: true,
  });

  const rows = bundles ? Object.values(bundles.entities) : [];
  const rowsMail = mails ? Object.values(mails.entities) : [];
  if (bundleItems) {
    let items = Object.values(bundleItems.entities);
    setRowsBundleItems(items);
  }
  //bundleItems ? setRowsBundleItems(Object.values(bundleItems.entities)) : [];

  const [addNewBundle, { isLoading: isILoading, isSuccess: isISuccess, isError: isIErorr, error: Ierror }] = useAddNewBundleMutation();
  const [updateBundle, { isLoading: isULoading, isSuccess: isUSuccess, isError: isUErorr, error: Uerror }] = useUpdateBundleMutation();
  const [deleteBundle, { isLoading: isDLoading, isSuccess: isDSuccess, isError: isDError, error: Derror }] = useDeleteBundleMutation();

  const handleEdit = (id) => navigate(`/dash/bundles/${id}`);
  const handleDelete = async (id) => await deleteBundle({ id: [id] });
  const onDeleteBundlesClicked = async () => await deleteBundle({ id: selection });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenPackage = () => setOpenPackage(true);
  const handleClosePackage = () => setOpenPackage(false);

  useEffect(() => {
    if (isISuccess || isUSuccess || isDSuccess) {
      handleClose();
    }
    if (isDSuccess) {
      refetch();
    }
  }, [isISuccess, isUSuccess, isDSuccess, refetch]);

  if (isFetching || isILoading || isULoading || isDLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  if (isError || isIErorr || isUErorr || isDError) {
    return (
      <Snackbar open={true} autoHideDuration={6000}>
        <Alert severity="error">An error occurred. Please try again.</Alert>
      </Snackbar>
    );
  }

  const onSaveBundleClicked = async () => {
    await addNewBundle({
      user: userid,
      bundleNo,
      bundleBranch,
      bundleWgt,
      bundleDate,
      bundleType,
      innerNo,
      sumWgt,
      sumCnt,
      items: rowsBundleItems,
    });
  };

  const onSaveBundleItemClicked = async (data) => {
    const selectedRowsData = selectionMail.map((id) => rowsMail.find((row) => row.id === id));
    console.log(selectedRowsData);

    for (let i = 0; i < selectedRowsData.length; i++) {
      setRowsBundleItems((prevRows) => [
        ...prevRows,
        {
          id: selectedRowsData[i].id,
          mailId: selectedRowsData[i].id,
          mailNo: selectedRowsData[i].mailId,
          wgt: selectedRowsData[i].mailWgt,
          riskType: selectedRowsData[i].riskType,
          bundleNo: bundleNo,
        },
      ]);
      sumwgt += selectedRowsData[i].mailWgt;
    }
    setSumWgt(sumwgt);
    setSumCnt(selectedRowsData.length);
    handleClosePackage();
    console.log("rowinserted", rowsBundleItems);
  };

  if (isSuccess) {
    return (
      <Box sx={{ height: 400, width: "100%" }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 1 }}>
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
        {isDError ? <Alert severity="error">{Derror?.data?.message}</Alert> : <></>}
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
            localeText={gridDefaultLocaleText}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                csvOptions: { disableToolbarButton: true },
                printOptions: { disableToolbarButton: true },
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 250 },
              },
            }}
            loading={isFetching}
          />
        </div>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ m: 1 }}>
          <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
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
              <Paper variant="outlined">
                <Grid container columns={11}>
                  <Grid item xs={11}>
                    <Typography variant="h6" m={2}>
                      Барааны мэдээлэл
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl>
                      <CustomFormLabel name="Багц хүлээн авах салбар" />
                      <CustomInput
                        value={bundleBranch}
                        onChange={(e) => {
                          setBundleBranch(e.target.value);
                        }}
                      />
                      <CustomFormLabel name="Богцны огноо" />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          size="small"
                          defaultValue={dayjs()}
                          format="YYYY-MM-DD"
                          onChange={(e) => setBundleDate(e.format("YYYY-MM-DD"))}
                          slotProps={{ textField: { size: "small" } }}
                          sx={{ mx: 2, mb: 1 }}
                        />
                      </LocalizationProvider>
                      <CustomFormLabel name="Нийт жин" />
                      <DisabledInput value={sumWgt} disabled={true} size="small" sx={{ mx: 2, mb: 1 }} />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl>
                      <CustomFormLabel name="Богцны дугаар" />
                      <CustomInput
                        value={bundleNo}
                        onChange={(e) => {
                          setBundleNo(e.target.value);
                        }}
                      />
                      <CustomFormLabel name="Илгээмжний төрөл" />
                      <CustomInput
                        value={bundleType}
                        onChange={(e) => {
                          setBundleType(e.target.value);
                        }}
                      />
                      <CustomFormLabel name="Нийт шуудан" />
                      <DisabledInput value={sumCnt} disabled={true} size="small" sx={{ mx: 2, mb: 1 }} />
                    </FormControl>
                  </Grid>
                  <Grid item xs={5}>
                    <Stack>
                      <CustomFormLabel name="Богцны жин" />
                      <CustomInput
                        value={bundleWgt}
                        onChange={(e) => {
                          setBundleWgt(e.target.value);
                        }}
                        InputProps={{
                          endAdornment: <InputAdornment position="start">KG</InputAdornment>,
                        }}
                      />
                      <CustomFormLabel name="Дотуур дагаврын дугаар" />
                      <CustomInput
                        value={innerNo}
                        onChange={(e) => {
                          setInnerNo(e.target.value);
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 2, mt: 1 }}>
                {bundleNo !== "" ? (
                  <Button
                    sx={{
                      bgcolor: "#6366F1",
                      ":hover": { bgcolor: "#4338CA" },
                    }}
                    variant="contained"
                    endIcon={<SaveIcon />}
                    onClick={handleOpenPackage}
                    size="small"
                  >
                    Илгээмж нэмэх
                  </Button>
                ) : (
                  <></>
                )}
              </Stack>
              <div style={{ height: 400 }}>
                <DataGrid
                  sx={{ boxShadow: 2, bgcolor: "#fff" }}
                  rows={rowsBundleItems}
                  onRowSelectionModelChange={setSelection}
                  {...rowsBundleItems}
                  getRowId={(row) => row.mailId}
                  columns={bundleItemColumns}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  rowsPerPageOptions={[10, 20, 30]}
                  checkboxSelection
                  disableSelectionOnClick
                  density="compact"
                  localeText={gridDefaultLocaleText}
                />
              </div>
            </Box>
          </Modal>
          <Modal open={openPackage} onClose={handleClosePackage}>
            <Box sx={style}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 2 }}>
                <Button
                  sx={{
                    bgcolor: "#6366F1",
                    ":hover": { bgcolor: "#4338CA" },
                  }}
                  variant="contained"
                  endIcon={<SaveIcon />}
                  size="small"
                  onClick={onSaveBundleItemClicked}
                >
                  Хадгалах
                </Button>
              </Stack>
              <div style={{ height: 600 }}>
                <DataGrid
                  sx={{ boxShadow: 2, bgcolor: "#fff" }}
                  rows={rowsMail}
                  onRowSelectionModelChange={setSelectionMail}
                  columns={mailColumns}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  rowsPerPageOptions={[10, 20, 30]}
                  checkboxSelection
                  disableSelectionOnClick
                  density="compact"
                  localeText={gridDefaultLocaleText}
                />
              </div>
            </Box>
          </Modal>
        </Stack>
      </Box>
    );
  }
};
export default BundlesList;
