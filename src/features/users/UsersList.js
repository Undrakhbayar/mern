import React from "react";
import { useGetUsersQuery, useAddNewUserMutation, useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Stack,
  FormControl,
  InputAdornment,
  TextField,
  Alert,
  ThemeProvider,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Snackbar,
  IconButton,
} from "@mui/material";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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

const BranchesList = () => {
  const columns = [
    {
      field: "username",
      headerName: "Нэвтрэх нэр",
      width: 300,
      cellClassName: () => {
        return "custom-cell";
      },
    },
    {
      field: "firstName",
      headerName: "Салбарын нэр",
      width: 250,
      valueGetter: (params) => `${params.row.lastName}. ${params.row.firstName}`,
    },
    {
      field: "phone",
      headerName: "Утасны дугаар",
      width: 300,
    },
    {
      field: "roles",
      headerName: "Эрх",
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
  const { userid, compregister, compname, comptel, compaddr } = useAuth();
  const [mode, setMode] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState(null);
  const { data: branches, isFetching, isError, isSuccess, refetch } = useGetUsersQuery("usersList", { refetchOnMountOrArgChange: true });
  const rows = branches ? Object.values(branches.entities) : [];
  const [addNewUser, { isLoading: isILoading, isSuccess: isISuccess, isError: isIErorr, error: Ierror }] = useAddNewUserMutation();
  const [updateUser, { isLoading: isULoading, isSuccess: isUSuccess, isError: isUErorr, error: Uerror }] = useUpdateUserMutation();
  const [deleteBranch, { isLoading: isDLoading, isSuccess: isDSuccess, isError: isDError, error: derror }] = useDeleteUserMutation();

  const validationSchema = Yup.object().shape({
    username: Yup.string().email("Зөв имэйл оруулна уу").required("Нэвтрэх нэр буюу имэйл оруулна уу"),
    password: Yup.string().required("Нууц үг оруулна уу"),
    passwordRe: Yup.string().oneOf([Yup.ref("password"), null], "Нууц үг давтана уу"),
    lastName: Yup.string().required("Овог оруулна уу"),
    firstName: Yup.string().required("Нэр оруулна уу"),
    phone: Yup.string().required("Утасны дугаар оруулна уу"),
  });
  let emailToValidate = "test@example.com";

  validationSchema
    .validate({ email: emailToValidate })
    .then(function (value) {
      console.log("Email is valid");
    })
    .catch(function (err) {
      console.log("Email is not valid: ", err.errors);
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
    setValue("username", "");
    setValue("password", "");
    setValue("passwordRe", "");
    setValue("lastName", "");
    setValue("firstName", "");
    setValue("phone", "");
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

  const handleCellClick = (params) => {
    if (params.field === "username" || params.field === "actions") {
      console.log(params);
      setMode("edit");
      setValue("username", params.row.username);
      //setValue("password", params.row.password);
      //setValue("passwordRe", params.row.password);
      setValue("lastName", params.row.lastName);
      setValue("firstName", params.row.firstName);
      setValue("phone", params.row.phone);
      setValue("userId", params.row.id);
      setOpen(true);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [showPasswordRe, setShowPasswordRe] = useState(false);
  const handleClickShowPasswordRe = () => setShowPasswordRe(!showPasswordRe);
  const handleMouseDownPasswordRe = () => setShowPasswordRe(!showPasswordRe);
  const onSubmit = async (data) => {
    const { username, password, firstName, lastName, phone, userId } = data;
    if (mode === "add") {
      await addNewUser({
        compRegister: compregister,
        compName: compname,
        compTel: comptel,
        compAddr: compaddr,
        created_user: userid,
        username,
        password,
        firstName,
        lastName,
        phone,
      });
    } else {
      await updateUser({
        id: userId,
        updated_user: userid,
        username,
        password,
        firstName,
        lastName,
        phone,
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

                  <Grid item xs={12}>
                    <FormControl>
                      <CustomFormLabel name="Нэвтрэх нэр" required />
                      <Controller
                        name="username"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            sx={{ mx: 2, mb: 1 }}
                            disabled={mode === "edit"}
                            error={errors.username ? true : false}
                            helperText={errors.username ? errors.username.message : ""}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl>
                      <CustomFormLabel name="Нууц үг" required />
                      <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            sx={{ mx: 2, mb: 1 }}
                            error={errors.password ? true : false}
                            helperText={errors.password ? errors.password.message : ""}
                            type={showPassword ? "text" : "password"}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl>
                      <CustomFormLabel name="Нууц үг давтах" required />
                      <Controller
                        name="passwordRe"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            sx={{ mx: 2, mb: 1 }}
                            error={errors.passwordRe ? true : false}
                            helperText={errors.passwordRe ? errors.passwordRe.message : ""}
                            type={showPasswordRe ? "text" : "password"}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={handleClickShowPasswordRe} onMouseDown={handleMouseDownPasswordRe}>
                                    {showPasswordRe ? <Visibility /> : <VisibilityOff />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl>
                      <CustomFormLabel name="Овог" required />
                      <Controller
                        name="lastName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            sx={{ mx: 2, mb: 1 }}
                            error={errors.lastName ? true : false}
                            helperText={errors.lastName ? errors.lastName.message : ""}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl>
                      <CustomFormLabel name="Нэр" required />
                      <Controller
                        name="firstName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            sx={{ mx: 2, mb: 1 }}
                            error={errors.firstName ? true : false}
                            helperText={errors.firstName ? errors.firstName.message : ""}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl>
                      <CustomFormLabel name="Утас" required />
                      <Controller
                        name="phone"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            sx={{ mx: 2, mb: 1 }}
                            error={errors.phone ? true : false}
                            helperText={errors.phone ? errors.phone.message : ""}
                          />
                        )}
                      />
                    </FormControl>
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
