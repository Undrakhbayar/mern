import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Stack,
  Alert,
  Typography,
  Autocomplete,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  ThemeProvider,
  Container,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { GreenRedSwitch, CustomInput, CustomFormLabel, theme, DisabledInput } from "../../components/Components";
import useAuth from "../../hooks/useAuth";

const USER_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PWD_REGEX = /^[A-z0-9!@#$%.]{6,100}$/;

const NewUserForm = () => {
  const { compname, compregister, comptel, compaddr } = useAuth();
  const [addNewUser, { isLoading, isSuccess, isError, error }] = useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);
  const [compName] = useState(compname);
  const [compRegister] = useState(compregister);
  const [compAddr] = useState(compaddr);
  const [compTel] = useState(comptel);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions, //HTMLCollection
      (option) => option.value
    );
    setRoles(values);
  };

  const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    alert(compName);
    if (canSave) {
      await addNewUser({ username, password, roles, compName, compTel, compRegister, compAddr });
    }
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {" "}
        {role}
      </option>
    );
  });

  const validRolesClass = !Boolean(roles.length) ? "form__input--incomplete" : "";

  const content = (
    <>
      {/* <form className="form" onSubmit={onSaveUserClicked}> */}
      <label className="form__label" htmlFor="roles">
        ASSIGNED ROLES:
      </label>
      <select id="roles" name="roles" className={`form__select ${validRolesClass}`} multiple={true} size="3" value={roles} onChange={onRolesChanged}>
        {options}
      </select>
      {/* </form> */}
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl">
          <Box component="form" onSubmit={onSaveUserClicked}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 1 }}>
              <Button
                sx={{
                  bgcolor: "#6366F1",
                  ":hover": { bgcolor: "#4338CA" },
                }}
                variant="contained"
                endIcon={<SaveIcon />}
                type="submit"
                size="small"
              >
                Хадгалах
              </Button>
            </Stack>
            <Paper sx={{ pl: 2, pb: 3 }}>
              <Grid container columns={12}>
                <Grid item xs={12}>
                  <Typography variant="h6" m={2}>
                    Үндсэн мэдээлэл
                  </Typography>
                  {isError ? (
                    <Alert variant="outlined" severity="error">
                      {error?.data?.message}
                    </Alert>
                  ) : (
                    <></>
                  )}

                  <FormControl>
                    <CustomFormLabel name="username" />
                    <TextField
                      value={username}
                      error={!validUsername}
                      size="small"
                      helperText={!validUsername?"Имэйл оруулна уу":""}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                    />
                    <CustomFormLabel name="password" />
                    <CustomInput
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );

  return content;
};
export default NewUserForm;
