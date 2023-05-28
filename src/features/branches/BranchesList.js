import * as React from "react";
import { useGetBranchesQuery, useAddNewBranchMutation } from "./branchesApiSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Grid, Button, Stack, Typography, FormControl, Modal, Autocomplete, TextField, Alert } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import gridDefaultLocaleText from "../../components/LocalTextConstants";
import { CustomInput, CustomFormLabel, style } from "../../components/Components";
import useAuth from "../../hooks/useAuth";
import { REFERENCE_URL } from "../../config/common";

const BranchesList = () => {
  const { userid, compregister } = useAuth();
  const columns = [
    {
      field: "branchCode",
      headerName: "Салбарын код",
      width: 250,
    },
    {
      field: "branchName",
      headerName: "Салбарын нэр",
      width: 200,
    },
    {
      field: "branchCurr",
      headerName: "Салбарын тооцох нэгж",
      width: 200,
    },
    {
      field: "branchCountry",
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
  const [branchCountry, setBranchCountry] = useState("");
  const [branchAddr, setBranchAddr] = useState("");

  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [pageSize, setPageSize] = useState(10);
  let content;
  let rows = [];
  const referenceUrl = REFERENCE_URL;
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
      branchCountry,
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

      setCountries(countries);
      setCurrencies(currencies);
    };
    getReferences();
  }, [referenceUrl]);

  content = (
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
            <Paper variant="outlined" sx={{ pb: 2, mb: 2 }}>
              <Grid container columns={11}>
                <Grid item xs={11}>
                  <Typography variant="h6" m={2}>
                    Барааны мэдээлэл
                  </Typography>
                  {isIErorr ? <Alert severity="error">{Ierror?.data?.message}</Alert> : <></>}
                </Grid>
                <Grid item xs={3}>
                  <FormControl>
                    <CustomFormLabel name="Салбарын код" />
                    <CustomInput
                      value={branchCode}
                      onChange={(e) => {
                        setBranchCode(e.target.value);
                      }}
                    />
                    <CustomFormLabel name="Салбарын нэр" />
                    <CustomInput
                      value={branchName}
                      onChange={(e) => {
                        setBranchName(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <Stack>
                    <CustomFormLabel name="Салбарын тооцох нэгж" />
                    <Autocomplete
                      size="small"
                      sx={{ mx: 2 }}
                      fullWidth={false}
                      options={currencies.map((option) => option.value)}
                      renderInput={(params) => <TextField variant="outlined" {...params} />}
                      onChange={(e) => {
                        setBranchCurr(e.target.textContent);
                      }}
                    />
                    <CustomFormLabel name="Салбар байрших улс" />
                    <Autocomplete
                      size="small"
                      sx={{ mx: 2 }}
                      fullWidth={false}
                      options={countries.map((option) => option.value)}
                      renderInput={(params) => <TextField variant="outlined" {...params} />}
                      onChange={(e) => {
                        setBranchCountry(e.target.textContent);
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={5}>
                  <Stack>
                    <CustomFormLabel name="Хаяг" />
                    <CustomInput
                      value={branchAddr}
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
                onClick={onSaveBranchClicked}
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
export default BranchesList;
