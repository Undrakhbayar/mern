import React from "react";
import { useGetBranchesQuery, useAddNewBranchMutation, useUpdateBranchMutation, useDeleteBranchMutation } from "./branchesApiSlice";
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Stack,
  FormControl,
  Autocomplete,
  TextField,
  Alert,
  ThemeProvider,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import gridDefaultLocaleText from "../../components/LocalTextConstants";
import { CustomFormLabel, theme } from "../../components/Components";
import useAuth from "../../hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import * as XLSX from "xlsx";

const BranchesList = () => {
  const columns = [
    {
      field: "branchCode",
      headerName: "Салбарын код",
      width: 150,
    },
    {
      field: "branchName",
      headerName: "Салбарын нэр",
      width: 250,
      cellClassName: () => {
        return "custom-cell";
      },
    },
    {
      field: "branchCurr",
      headerName: "Салбарын тооцох нэгж",
      width: 250,
      valueGetter: (params) => `${params.row.branchCurr.code} - ${params.row.branchCurr.name}`,
    },
    {
      field: "branchCountry",
      headerName: "Салбар байрших улс",
      width: 300,
      valueGetter: (params) => `${params.row.branchCountry.code} - ${params.row.branchCountry.name}`,
    },
    {
      field: "branchAddr",
      headerName: "Хаяг",
      width: 300,
    },
    {
      field: "actions",
      headerName: "Засах / Устгах",
      colspan: 2,
      sortable: false,
      width: 200,
      type: "actions",
      getActions: ({ row }) => [
        <GridActionsCellItem
          key={1}
          icon={<EditIcon />}
          sx={{ padding: "2px 6px", color: "success.main" }}
          label="Засах"
          onClick={() => {
            handleCellClick(row);
          }}
        />,
        <GridActionsCellItem
          key={2}
          icon={<DeleteIcon />}
          sx={{ padding: "2px 6px", color: "error.main" }}
          label="Устгах"
          onClick={(event) => {
            event.stopPropagation();
            askDeleteConfirmation(row);
          }}
        />,
      ],
    },
  ];
  const { userid, compregister } = useAuth();
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [mode, setMode] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState(null);
  const { data: branches, isFetching, isError, isSuccess, refetch } = useGetBranchesQuery(compregister, { refetchOnMountOrArgChange: true });
  const rows = branches ? Object.values(branches.entities) : [];
  const [addNewBranch, { isLoading: isILoading, isSuccess: isISuccess, isError: isIErorr, error: Ierror }] = useAddNewBranchMutation();
  const [updateBranch, { isLoading: isULoading, isSuccess: isUSuccess, isError: isUErorr, error: Uerror }] = useUpdateBranchMutation();
  const [deleteBranch, { isLoading: isDLoading, isSuccess: isDSuccess, isError: isDError, error: derror }] = useDeleteBranchMutation();
  const validationSchema = Yup.object().shape({
    branchCode: Yup.string().required("Салбарын код оруулна уу"),
    branchName: Yup.string().required("Салбарын нэр оруулна уу"),
    branchAddr: Yup.string().required("Салбарын хаяг оруулна уу"),
    branchCurr: Yup.object().required("Салбарын тооцох нэгж сонгоно уу"),
    branchCountry: Yup.object().required("Салбар байрших улс сонгоно уу"),
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const handleOpen = (mode) => {
    setMode(mode);
    setValue("branchCode", "");
    setValue("branchName", "");
    setValue("branchCurr", null);
    setValue("branchCountry", null);
    setValue("branchAddr", "");
    setValue("branchId", "");
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const askDeleteConfirmation = (row) => {
    setRowToDelete(row);
    setOpenConfirm(true);
  };

  const handleDelete = async () => {
    await deleteBranch({ id: rowToDelete.id });
    setOpenConfirm(false);
  };

  const handleCancel = () => {
    setRowToDelete(null);
    setOpenConfirm(false);
  };
  const downloadExcel = (data) => {
    const edited = data.map((row) => ({
      name: row.branchCountry.code + " - " + row.branchCountry.name,
      birthday: row.branchCode,
    }));
    console.log(edited);
    const worksheet = XLSX.utils.json_to_sheet(edited);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  const handleCellClick = (params) => {
    console.log(params);
    if (params.field === "branchName" || params.field === "actions") {
      setMode("edit");
      setValue("branchCode", params.row.branchCode);
      setValue("branchName", params.row.branchName);
      setValue("branchCurr", params.row.branchCurr);
      setValue("branchCountry", params.row.branchCountry);
      setValue("branchAddr", params.row.branchAddr);
      setValue("branchId", params.row.id);
      setOpen(true);
    }
  };

  const onSubmit = async (data) => {
    const { branchCode, branchName, branchCurr, branchCountry, branchAddr, branchId } = data;
    if (mode === "add") {
      await addNewBranch({
        compRegister: compregister,
        created_user: userid,
        branchCode,
        branchName,
        branchCurr,
        branchCountry,
        branchAddr,
      });
    } else {
      await updateBranch({
        id: branchId,
        updated_user: userid,
        branchCode,
        branchName,
        branchCurr,
        branchCountry,
        branchAddr,
      });
    }
  };

  useEffect(() => {
    if (isISuccess || isUSuccess || isDSuccess) {
      handleClose();
    }
    if (isDSuccess) {
      refetch();
    }
  }, [isISuccess, isUSuccess, isDSuccess, refetch]);

  useEffect(() => {
    const getReferences = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_REFERENCE_URL + "?reportType", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch references");
        }
        const response = await res.json();

        let countries = response.filter(({ type }) => type === "country");
        let currencies = response.filter(({ type }) => type === "currency");

        countries = countries.map(({ type, ...rest }) => rest);
        currencies = currencies.map(({ type, ...rest }) => rest);
        setCountries(countries);
        setCurrencies(currencies);
      } catch (error) {
        console.error(error);
      }
    };
    getReferences();
  }, []);

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
  if (isSuccess) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ height: 400, width: "100%" }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 1 }}>
            <Button
              sx={{
                bgcolor: "#6366F1",
                ":hover": { bgcolor: "#4338CA" },
              }}
              variant="contained"
              endIcon={<DownloadIcon />}
              onClick={() => downloadExcel(rows)}
              size="small"
            >
              Excel
            </Button>
            <Button
              sx={{
                bgcolor: "#6366F1",
                ":hover": { bgcolor: "#4338CA" },
              }}
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => handleOpen("add")}
              size="small"
            >
              Нэмэх
            </Button>
          </Stack>
          <div style={{ height: 600 }}>
            <DataGrid
              sx={{ boxShadow: 2, bgcolor: "#fff" }}
              rows={rows}
              columns={columns}
              pageSize={pageSize}
              onCellClick={handleCellClick}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[10, 20, 30]}
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
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container columns={12}>
                  <Grid item xs={12}>
                    <DialogTitle color="#4338CA" sx={{ mb: 2, mx: 2, py: 1, pl: 0, borderBottom: 2, borderColor: "#4338CA", fontWeight: 600 }}>
                      {mode === "add" ? "Салбарын мэдээлэл нэмэх" : "Салбарын мэдээлэл засах"}
                    </DialogTitle>
                    {isIErorr ? <Alert severity="error">{Ierror?.data?.message}</Alert> : <></>}
                    {isUErorr ? <Alert severity="error">{Uerror?.data?.message}</Alert> : <></>}
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl>
                      <CustomFormLabel name="Салбарын код" required />
                      <Controller
                        name="branchCode"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            sx={{ mx: 2, mb: 1 }}
                            disabled={mode === "edit"}
                            error={errors.branchCode ? true : false}
                            helperText={errors.branchCode ? errors.branchCode.message : ""}
                          />
                        )}
                      />
                      <CustomFormLabel name="Салбарын нэр" required />
                      <Controller
                        name="branchName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            sx={{ mx: 2, mb: 1 }}
                            error={errors.branchName ? true : false}
                            helperText={errors.branchName ? errors.branchName.message : ""}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack>
                      <CustomFormLabel name="Салбарын тооцох нэгж" required />
                      <Controller
                        name="branchCurr"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <Autocomplete
                            size="small"
                            sx={{ mx: 2, mb: 1 }}
                            options={currencies}
                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
                            isOptionEqualToValue={(option, value) => option.code === value.code}
                            renderInput={(params) => (
                              <TextField {...params} error={!!errors.branchCurr} helperText={errors.branchCurr ? errors.branchCurr.message : ""} />
                            )}
                            {...field}
                            onChange={(_, data) => field.onChange(data)}
                            value={getValues("branchCurr")}
                          />
                        )}
                      />
                      <CustomFormLabel name="Салбар байрших улс" required />
                      <Controller
                        name="branchCountry"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <Autocomplete
                            size="small"
                            sx={{ mx: 2, mb: 1 }}
                            options={countries}
                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
                            isOptionEqualToValue={(option, value) => option.code === value.code}
                            renderInput={(params) => (
                              <TextField {...params} error={!!errors.branchCountry} helperText={errors.branchCountry ? errors.branchCountry.message : ""} />
                            )}
                            {...field}
                            onChange={(_, data) => field.onChange(data)}
                            value={getValues("branchCountry")}
                          />
                        )}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack>
                      <CustomFormLabel name="Хаяг" required />
                      <Controller
                        name="branchAddr"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            sx={{ mx: 2, mb: 1 }}
                            error={errors.branchAddr ? true : false}
                            helperText={errors.branchAddr ? errors.branchAddr.message : ""}
                          />
                        )}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <DialogActions>
                  <Button
                    sx={{
                      bgcolor: "#6366F1",
                      ":hover": { bgcolor: "#4338CA" },
                    }}
                    variant="contained"
                    size="small"
                    onClick={handleClose}
                  >
                    Хаах
                  </Button>
                  <Button
                    sx={{
                      bgcolor: "#6366F1",
                      ":hover": { bgcolor: "#4338CA" },
                    }}
                    variant="contained"
                    size="small"
                    type="submit"
                  >
                    Хадгалах
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={openConfirm} onClose={handleCancel}>
            <DialogTitle>Устгах уу?</DialogTitle>
            <DialogActions>
              <Button onClick={handleCancel} color="primary">
                Үгүй
              </Button>
              <Button onClick={handleDelete} color="primary" autoFocus>
                Тийм
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </ThemeProvider>
    );
  }
};
export default BranchesList;
