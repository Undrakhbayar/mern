import React from "react";
import { useGetBranchesQuery, useAddNewBranchMutation, useUpdateBranchMutation } from "./branchesApiSlice";
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Stack,
  Typography,
  FormControl,
  Autocomplete,
  TextField,
  Alert,
  ThemeProvider,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import gridDefaultLocaleText from "../../components/LocalTextConstants";
import { CustomFormLabel, theme } from "../../components/Components";
import useAuth from "../../hooks/useAuth";
import { REFERENCE_URL } from "../../config/common";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import * as XLSX from "xlsx";

const BranchesList = () => {
  const { userid, compregister } = useAuth();
  const columns = [
    {
      field: "branchCode",
      headerName: "Салбарын код",
      width: 200,
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
      width: 300,
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
  ];
  const [compRegister] = useState(compregister);
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchCurr, setBranchCurr] = useState("");
  const [branchCountry, setBranchCountry] = useState("");
  const [branchAddr, setBranchAddr] = useState("");

  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [editYn, setEditYn] = useState("");
  let content;
  let rows = [];
  const referenceUrl = REFERENCE_URL;
  const [open, setOpen] = React.useState(false);
  const [pageSize, setPageSize] = useState(10);

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
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      branchCode: "",
      branchName: "",
      branchAddr: "",
    },
  });
  const handleOpen = (params) => {
    setEditYn("N");
  };
  useEffect(() => {
    if (editYn === "N" || editYn === "Y") {
      console.log(editYn);
      setOpen(true);
    }
  }, [editYn]);
  const handleClose = () => setOpen(false);

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
    setEditYn("Y");
    reset(params.row);
  };

  const onSubmit = (data) => {
    onSaveBranchClicked();
  };

  const {
    data: branches,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetBranchesQuery(compregister, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [addNewBranch, { isLoading: isILoading, isSuccess: isISuccess, isError: isIErorr, error: Ierror }] = useAddNewBranchMutation();
  const [updateBranch, { isLoading: isULoading, isSuccess: isUSuccess, isError: isUErorr, error: Uerror }] = useUpdateBranchMutation();

  const onSaveBranchClicked = async () => {
    if (editYn === "N") {
      await addNewBranch({
        user: userid,
        compRegister,
        branchCode,
        branchName,
        branchCurr,
        branchCountry,
        branchAddr,
      });
    } else {
      await updateBranch({
        user: userid,
        compRegister,
        branchCode,
        branchName,
        branchCurr,
        branchCountry,
        branchAddr,
      });
    }
  };
  if (isLoading || isILoading || isULoading) content = <p>Loading...</p>;

  if (isError || isIErorr || isUErorr) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { entities } = branches;
    rows = Object.values(entities);
  }

  useEffect(() => {
    if (isISuccess || isUSuccess) {
      handleClose();
    }
  }, [isISuccess, isUSuccess]);

  useEffect(() => {
    const getReferences = async () => {
      const res = await fetch(referenceUrl + "?reportType", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      let countries = response.filter(({ type }) => type === "country");
      let currencies = response.filter(({ type }) => type === "currency");

      countries = countries.map(({ type, ...rest }) => rest);
      currencies = currencies.map(({ type, ...rest }) => rest);
      setCountries(countries);
      setCurrencies(currencies);
    };
    getReferences();
  }, [referenceUrl]);

  content = (
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
            onClick={handleOpen}
            size="small"
          >
            Нэмэх
          </Button>
        </Stack>
        <div style={{ height: 600 }}>
          <DataGrid
            sx={{ boxShadow: 2, bgcolor: "#fff" }}
            rows={rows}
            {...rows}
            columns={columns}
            pageSize={pageSize}
            onCellClick={handleCellClick}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 20, 30]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            density="compact"
            localeText={gridDefaultLocaleText}
            components={{
              Toolbar: GridToolbar,
            }}
            componentsProps={{
              toolbar: {
                csvOptions: { disableToolbarButton: true },
                printOptions: { disableToolbarButton: true },
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 250 },
              },
            }}
            loading={isLoading}
          />
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container columns={12}>
                <Grid item xs={12}>
                  <Typography variant="h6" color="#4338CA" sx={{ mb: 2, mx: 2, py: 1, borderBottom: 2, borderColor: "#4338CA", fontWeight: 600 }}>
                    Салбарын мэдээлэл
                  </Typography>
                  {isIErorr ? <Alert severity="error">{Ierror?.data?.message}</Alert> : <></>}
                  {isUErorr ? <Alert severity="error">{Uerror?.data?.message}</Alert> : <></>}
                </Grid>
                <Grid item xs={6}>
                  <FormControl>
                    <CustomFormLabel name="Салбарын код" required />
                    <Controller
                      name="branchCode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          sx={{ mx: 2, mb: 1 }}
                          error={errors.branchCode ? true : false}
                          helperText={errors.branchCode ? errors.branchCode.message : ""}
                          onChange={(e) => {
                            field.onChange(e);
                            setBranchCode(e.target.value);
                          }}
                        />
                      )}
                    />
                    <CustomFormLabel name="Салбарын нэр" required />
                    <Controller
                      name="branchName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          sx={{ mx: 2, mb: 1 }}
                          error={errors.branchName ? true : false}
                          helperText={errors.branchName ? errors.branchName.message : ""}
                          onChange={(e) => {
                            field.onChange(e);
                            setBranchName(e.target.value);
                          }}
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
                          onChange={(e, value) => {
                            field.onChange(value);
                            setBranchCurr(value);
                          }}
                          value={field.value}
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
                          onChange={(e, data) => {
                            console.log(data);
                            field.onChange(data);
                            setBranchCountry(data);
                          }}
                          value={field.value}
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
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          sx={{ mx: 2, mb: 1 }}
                          error={errors.branchAddr ? true : false}
                          helperText={errors.branchAddr ? errors.branchAddr.message : ""}
                          onChange={(e) => {
                            field.onChange(e);
                            setBranchAddr(e.target.value);
                          }}
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
      </Box>
    </ThemeProvider>
  );
  return content;
};
export default BranchesList;
