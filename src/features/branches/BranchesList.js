import * as React from "react";
import { useGetBranchesQuery, useAddNewBranchMutation } from "./branchesApiSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Grid, Button, Stack, Typography, FormControl, Modal, Autocomplete, TextField, Alert, ThemeProvider, Link } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import gridDefaultLocaleText from "../../components/LocalTextConstants";
import { CustomInput, CustomFormLabel, style, theme } from "../../components/Components";
import useAuth from "../../hooks/useAuth";
import { REFERENCE_URL } from "../../config/common";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

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
      renderCell: (params) => {
        return (
          <Link style={{ cursor: "pointer" }} underline="none" onClick={() => handleOpenEdit(params.row)}>
            {params.row.branchName}
          </Link>
        );
      },
    },
    {
      field: "branchCurr",
      headerName: "Салбарын тооцох нэгж",
      width: 200,
    },
    {
      field: "branchCountryNm",
      headerName: "Салбар байрших улс",
      width: 200,
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
  const [branchCurrNm, setBranchCurrNm] = useState("");
  const [branchCountry, setBranchCountry] = useState("");
  const [branchCountryNm, setBranchCountryNm] = useState("");
  const [branchAddr, setBranchAddr] = useState("");

  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [branchCurrObject, setBranchCurrObject] = useState(null);
  const [branchCountryObject, setBranchCountryObject] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenEdit = (params) => {
    console.log(params);
    setOpen(true);
    setBranchCode(params.branchCode);
    setBranchName(params.branchName);
    setBranchAddr(params.branchAddr);
    setBranchCurr(params.branchCurr);
    setBranchCurrNm(params.branchCurrNm);
    setBranchCurrObject({ type: "currency", code: params.branchCurr, name: params.branchCurrNm });
    setBranchCountryObject({ type: "country", code: params.branchCountry, name: params.branchCountryNm });
    setBranchCode(params.branchCode);
    console.log(branchCurrObject);
    
  };
  const handleClose = () => setOpen(false);
  const [pageSize, setPageSize] = useState(10);
  let content;
  let rows = [];
  const referenceUrl = REFERENCE_URL;

  const validationSchema = Yup.object().shape({
    branchCode: Yup.string().required("Салбарын код оруулна уу"),
    branchName: Yup.string().required("Салбарын нэр оруулна уу"),
    branchAddr: Yup.string().required("Салбарын хаяг оруулна уу"),
    branchCurr: Yup.string().required("Салбарын тооцох нэгж сонгоно уу"),
    branchCountry: Yup.string().required("Салбар байрших улс сонгоно уу"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

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

  const onSaveBranchClicked = async () => {
    await addNewBranch({
      user: userid,
      compRegister,
      branchCode,
      branchName,
      branchCurr,
      branchCurrNm,
      branchCountry,
      branchCountryNm,
      branchAddr,
    });
  };
  if (isLoading || isILoading) content = <p>Loading...</p>;

  if (isError || isIErorr) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { entities } = branches;
    rows = Object.values(entities);
  }

  useEffect(() => {
    if (isISuccess) {
      handleClose();
    }
  }, [isISuccess]);

  useEffect(() => {
    const getReferences = async () => {
      const res = await fetch(referenceUrl + "?reportType", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      const countries = response.filter(({ type }) => type === "country");
      const currencies = response.filter(({ type }) => type === "currency");
      console.log(countries);
      console.log(currencies);
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
            endIcon={<SaveIcon />}
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
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 20, 30]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            density="compact"
            localeText={gridDefaultLocaleText}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ m: 1 }}>
          <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
              <Paper variant="outlined" sx={{ pb: 1, mb: 1 }}>
                <Grid container columns={12}>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="#4338CA" sx={{ mb: 2, mx: 2, py: 1, borderBottom: 2, borderColor: "#4338CA", fontWeight: 700 }}>
                      Салбарын мэдээлэл
                    </Typography>
                    {isIErorr ? <Alert severity="error">{Ierror?.data?.message}</Alert> : <></>}
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl>
                      <CustomFormLabel name="Салбарын код" required />
                      <TextField
                        value={branchCode}
                        {...register("branchCode")}
                        size="small"
                        sx={{ mx: 2, mb: 1 }}
                        error={errors.branchCode ? true : false}
                        helperText={errors.branchCode ? errors.branchCode.message : ""}
                        onChange={(e) => {
                          setBranchCode(e.target.value);
                        }}
                      />
                      <CustomFormLabel name="Салбарын нэр" required={true} />
                      <TextField
                        value={branchName}
                        {...register("branchName")}
                        size="small"
                        sx={{ mx: 2, mb: 1 }}
                        error={errors.branchName ? true : false}
                        helperText={errors.branchName ? errors.branchName.message : ""}
                        onChange={(e) => {
                          setBranchName(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack>
                      <CustomFormLabel name="Салбарын тооцох нэгж" required />
                      <Autocomplete
                        size="small"
                        sx={{ mx: 2, mb: 1 }}
                        fullWidth={false}
                        value={branchCurrObject}
                        options={currencies}
                        getOptionLabel={(option) => `${option.code} - ${option.name}`}
                        isOptionEqualToValue={(option, value) => option.code === value.code}
                        renderInput={(params) => (
                          <TextField
                            variant="outlined"
                            {...params}
                            
                            {...register("branchCurr")}
                            error={errors.branchCurr ? true : false}
                            helperText={errors.branchCurr ? errors.branchCurr.message : ""}
                          />
                        )}
                        onChange={(e, newValue) => {
                          setBranchCurr(newValue ? newValue.code : "");
                          setBranchCurrNm(newValue ? newValue.name : "");
                          setBranchCurrObject(newValue ? newValue : null);
                        }}
                      />
                      <CustomFormLabel name="Салбар байрших улс" required />
                      <Autocomplete
                        size="small"
                        sx={{ mx: 2 }}
                        fullWidth={false}
                        value={branchCountryObject}
                        options={countries}
                        getOptionLabel={(option) => `${option.code} - ${option.name}`}
                        isOptionEqualToValue={(option, value) => option.code === value.code}
                        renderInput={(params) => (
                          <TextField
                            variant="outlined"
                            {...params}
                            {...register("branchCountry")}
                            error={errors.branchCountry ? true : false}
                            helperText={errors.branchCountry ? errors.branchCountry.message : ""}
                          />
                        )}
                        onChange={(e, newValue) => {
                          setBranchCountry(newValue ? newValue.code : "");
                          setBranchCountryNm(newValue ? newValue.name : "");
                          setBranchCountryObject(newValue ? newValue : null);
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack>
                      <CustomFormLabel name="Хаяг" required />
                      <TextField
                        value={branchAddr}
                        {...register("branchAddr")}
                        size="small"
                        sx={{ mx: 2, mb: 1 }}
                        error={errors.branchAddr ? true : false}
                        helperText={errors.branchAddr ? errors.branchAddr.message : ""}
                        onChange={(e) => {
                          setBranchAddr(e.target.value);
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  sx={{
                    bgcolor: "#6366F1",
                    ":hover": { bgcolor: "#4338CA" },
                  }}
                  variant="contained"
                  endIcon={<SaveIcon />}
                  size="small"
                  onClick={handleSubmit(onSubmit)}
                >
                  Хадгалах
                </Button>
              </Stack>
            </Box>
          </Modal>
        </Stack>
      </Box>
    </ThemeProvider>
  );
  return content;
};
export default BranchesList;
