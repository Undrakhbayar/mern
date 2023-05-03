import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewPackageeMutation } from "./packageesApiSlice";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GreenRedSwitch, CustomInput, CustomFormLabel, theme } from "../../components/Components";
import { REFERENCE_URL } from "../../config/common";
import useAuth from '../../hooks/useAuth'

const NewPackageeForm = ({ users }) => {
  const [addNewPackagee, { isLoading, isSuccess, isError, error, data }] = useAddNewPackageeMutation();
  const navigate = useNavigate();
  const { userid, username, isManager, isAdmin, compname, compregister, comptel, compaddr } = useAuth();
  //console.log(userid, username, comptel, compregister, compname, compaddr);
  const [houseSeq, setHouseSeq] = useState("");
  const [mailId, setMailId] = useState("");
/*   const [mailBagNumber, setMailBagNumber] = useState("");
  const [blNo, setBlNo] = useState(""); */
  const [reportType, setReportType] = useState("");
  const [riskType, setRiskType] = useState("");
  const [transportType, setTransportType] = useState("");
  const [isDiplomat, setIsDiplomat] = useState("N");
  const [shipperCntryCd, setShipperCntryCd] = useState("");
  const [shipperCntryNm, setShipperCntryNm] = useState("");
  const [shipperNatinality, setShipperNatinality] = useState("");
  const [shipperNm, setShipperNm] = useState("");
  const [shipperReg, setShipperReg] = useState("");
  const [shipperAddr, setShipperAddr] = useState("");
  const [shipperTel, setShipperTel] = useState("");
  const [consigneeCntryCd, setConsigneeCntryCd] = useState("");
  const [consigneeCntryNm, setConsigneeCntryNm] = useState("");
  const [consigneeNatinality, setConsigneeNatinality] = useState("");
  const [consigneeNm, setConsigneeNm] = useState("");
  const [consigneeReg, setConsigneeReg] = useState("");
  const [consigneeAddr, setConsigneeAddr] = useState("");
  const [consigneeTel, setConsigneeTel] = useState("");
  const [compName] = useState(compname);
  const [compRegister] = useState(compregister);
  const [compAddr] = useState(compaddr);
  const [compTel] = useState(comptel);
  const [mailDate, setMailDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [userId, setUserId] = useState(userid);
  const [reportTypes, setReportTypes] = useState([]);
  const [transportTypes, setTransportTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isDiplomats, setIsDiplomats] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      setHouseSeq("");
      setUserId("");
      navigate(`/dash/packagees/${data}`);
    }
  }, [isSuccess, navigate]);

  const referenceUrl = REFERENCE_URL;
  console.log(referenceUrl);
  useEffect(() => {
    const getReferences = async () => {
      const res = await fetch(referenceUrl + "?reportType", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();
      console.log(response);

      const reportTypes = response.filter(({ type }) => type === "reportType");
      const transportTypes = response.filter(({ type }) => type === "transportType");
      const countries = response.filter(({ type }) => type === "country");
      const isDiplomats = response.filter(({ type }) => type === "diplomat");

      console.log(transportTypes);

      setReportTypes(reportTypes);
      setTransportTypes(transportTypes);
      setCountries(countries);
      setIsDiplomats(isDiplomats);
    };
    getReferences();
  }, []);

  const canSave = [mailId, userId].every(Boolean) && !isLoading;

  const onSavePackageeClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewPackagee({
        user: userId,
        houseSeq,
        mailId,
        /*         mailBagNumber,
        blNo, */
        reportType,
        riskType,
        transportType,
        isDiplomat,
        shipperCntryCd,
        shipperCntryNm,
        shipperNatinality,
        shipperNm,
        shipperReg,
        shipperAddr,
        shipperTel,
        consigneeCntryCd,
        consigneeCntryNm,
        consigneeNatinality,
        consigneeNm,
        consigneeReg,
        consigneeAddr,
        consigneeTel,
        compName,
        compRegister,
        compAddr,
        compTel,
        mailDate,
      });
    }
  };

  const content = (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl">
        <Box component="form" onSubmit={onSavePackageeClicked}>
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
          <Paper sx={{ pl: 2, pb:3 }}>
            <Grid container columns={12}>
              <Grid item xs={12}>
                <Typography variant="h6" m={2}>
                  Үндсэн мэдээлэл
                </Typography>
                {isError ? <Alert severity="error">{error?.data?.message}</Alert> : <></>}
              </Grid>
              <Grid item xs={3} >
                {/*             <CustomInput
              style={{ width: 50 }}
              value={houseSeq}
              label="№"
              inputProps={{ maxLength: 3 }}
              onChange={(e) => {
                setHouseSeq(e.target.value);
              }}
            /> */}
                <Stack>
                  <FormControl>
                    <CustomFormLabel name="Илгээмжийн дугаар" />
                    <CustomInput
                      value={mailId}
                      onChange={(e) => {
                        setMailId(e.target.value);
                      }}
                    />
                    <CustomFormLabel name="Ачаа хөдөлсөн огноо" />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        size="small"
                        defaultValue={dayjs()}
                        format="YYYY-MM-DD"
                        onChange={(e) => setMailDate(e.format("YYYY-MM-DD"))}
                        slotProps={{ textField: { size: "small" } }}
                        sx={{ mr: 2 }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack>
                  <FormControl>
                    <CustomFormLabel name="Маягтын төрөл" />
                    <Autocomplete
                      size="small"
                      style={{
                        display: "inline-flex",
                        width: 175,
                      }}
                      fullWidth={false}
                      options={reportTypes.map((option) => option.value)}
                      renderInput={(params) => <TextField variant="outlined" {...params} />}
                      onChange={(e) => {
                        setReportType(e.target.textContent);
                      }}
                    />
                    <CustomFormLabel name="Шуудангын төрөл" />
                    <Autocomplete
                      size="small"
                      style={{
                        display: "inline-flex",
                        width: 200,
                      }}
                      fullWidth={false}
                      options={transportTypes}
                      getOptionLabel={(option) => option.description}
                      renderInput={(params) => <TextField variant="outlined" {...params} />}
                      onChange={(e, newValue) => {
                        setTransportType(newValue ? newValue.value : "");
                      }}
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack>
                  <FormControl>
                    <CustomFormLabel name="Эрсдлийн төлөв" />
                    <FormGroup
                      style={{
                        display: "inline",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <GreenRedSwitch
                            defaultChecked
                            onChange={(e) => {
                              e.target.checked ? setRiskType("green") : setRiskType("red");
                            }}
                          />
                        }
                      />
                    </FormGroup>
                    <CustomFormLabel name="Дипломат эсэх" />
                    <RadioGroup
                      row
                      defaultValue="N"
                      onChange={(e) => {
                        setIsDiplomat(e.target.value);
                      }}
                    >
                      <FormControlLabel value="Y" control={<Radio />} label="Тийм" />
                      <FormControlLabel value="N" control={<Radio />} label="Үгүй" />
                    </RadioGroup>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" m={2}>
                  Илгээгчийн мэдээлэл
                </Typography>
                <FormControl>
                  <CustomFormLabel name="Улс хотын код" />
                  <CustomInput
                    value={shipperCntryCd}
                    onChange={(e) => {
                      setShipperCntryCd(e.target.value);
                    }}
                  />
                  <CustomFormLabel name="Харьяалал" />
                  <Autocomplete
                    size="small"
                    style={{
                      display: "inline-flex",
                    }}
                    fullWidth={false}
                    sx={{ mr: 2 }}
                    options={countries.map((option) => `${option.value}-${option.description}`)}
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(e) => {
                      console.log(e.target.textContent.split("-")[0]);
                      setShipperNatinality(e.target.textContent.split("-")[0]);
                    }}
                  />
                  <CustomFormLabel name="Регистр №" />
                  <CustomInput
                    value={shipperReg}
                    onChange={(e) => {
                      setShipperReg(e.target.value);
                    }}
                  />
                  <CustomFormLabel name="Хаяг" />
                  <CustomInput
                    value={shipperAddr}
                    style={{ width: 400 }}
                    onChange={(e) => {
                      setShipperAddr(e.target.value);
                    }}
                  />
                </FormControl>

                <FormControl>
                  <CustomFormLabel name="Улс хотын нэр" />
                  <CustomInput
                    value={shipperCntryNm}
                    onChange={(e) => {
                      setShipperCntryNm(e.target.value);
                    }}
                  />
                  <CustomFormLabel name="Нэр" />
                  <CustomInput
                    value={shipperNm}
                    onChange={(e) => {
                      setShipperNm(e.target.value);
                    }}
                  />
                  <CustomFormLabel name="Утасны дугаар" />
                  <CustomInput
                    value={shipperTel}
                    onChange={(e) => {
                      setShipperTel(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" m={2}>
                  Хүлээн авагчийн мэдээлэл
                </Typography>
                <FormControl>
                  <CustomFormLabel name="Улс хотын код" />
                  <CustomInput
                    value={consigneeCntryCd}
                    onChange={(e) => {
                      setConsigneeCntryCd(e.target.value);
                    }}
                  />
                  <CustomFormLabel name="Харьяалал" />
                  <Autocomplete
                    size="small"
                    style={{
                      display: "inline-flex",
                    }}
                    fullWidth={false}
                    sx={{ mr: 2 }}
                    options={countries.map((option) => `${option.value}-${option.description}`)}
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(e) => {
                      console.log(e.target.textContent.split("-")[0]);
                      setConsigneeNatinality(e.target.textContent.split("-")[0]);
                    }}
                  />
                  <CustomFormLabel name="Регистр №" />
                  <CustomInput
                    value={consigneeReg}
                    onChange={(e) => {
                      setConsigneeReg(e.target.value);
                    }}
                  />
                  <CustomFormLabel name="Хаяг" />
                  <CustomInput
                    value={consigneeAddr}
                    style={{ width: 400 }}
                    onChange={(e) => {
                      setConsigneeAddr(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl>
                  <CustomFormLabel name="Улс хотын нэр" />
                  <CustomInput
                    value={consigneeCntryNm}
                    onChange={(e) => {
                      setConsigneeCntryNm(e.target.value);
                    }}
                  />
                  <CustomFormLabel name="Нэр" />
                  <CustomInput
                    value={consigneeNm}
                    onChange={(e) => {
                      setConsigneeNm(e.target.value);
                    }}
                  />
                  <CustomFormLabel name="Утасны дугаар" />
                  <CustomInput
                    value={consigneeTel}
                    onChange={(e) => {
                      setConsigneeTel(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
              {/* <TextField
                label="Улс хотын код"
                size="small"
                value={shipperCntryCd}
                onChange={(e) => {
                  setShipperCntryCd(e.target.value);
                }}
              />
              <TextField
                label="Улс хотын нэр"
                size="small"
                value={shipperCntryNm}
                onChange={(e) => {
                  setShipperCntryNm(e.target.value);
                }}
              />
              <Autocomplete
                size="small"
                style={{
                  display: "inline-flex",
                }}
                fullWidth={false}
                options={countries.map((option) => `${option.value}-${option.description}`)}
                renderInput={(params) => <TextField {...params} label="Харьяалал" />}
                onChange={(e) => {
                  console.log(e.target.textContent.split("-")[0]);
                  setShipperNatinality(e.target.textContent.split("-")[0]);
                }}
              />
              <TextField
                label="Нэр"
                size="small"
                value={shipperNm}
                onChange={(e) => {
                  setShipperNm(e.target.value);
                }}
              />
              <TextField
                label="Регистр №"
                size="small"
                value={shipperReg}
                onChange={(e) => {
                  setShipperReg(e.target.value);
                }}
              />
              <TextField
                label="Утасны дугаар"
                size="small"
                value={shipperTel}
                onChange={(e) => {
                  setShipperTel(e.target.value);
                }}
              />
              <TextField
                label="Хаяг"
                size="small"
                style={{ width: 550 }}
                value={shipperAddr}
                onChange={(e) => {
                  setShipperAddr(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" m={2}>
                Хүлээн авагчийн мэдээлэл
              </Typography>
              <TextField
                label="Улс хотын код"
                size="small"
                value={consigneeCntryCd}
                onChange={(e) => {
                  setConsigneeCntryCd(e.target.value);
                }}
              />
              <TextField
                label="Улс хотын нэр"
                size="small"
                value={consigneeCntryNm}
                onChange={(e) => {
                  setConsigneeCntryNm(e.target.value);
                }}
              />
              <Autocomplete
                size="small"
                style={{
                  display: "inline-flex",
                }}
                fullWidth={false}
                options={countries.map((option) => "[" + option.value + "] " + option.description)}
                renderInput={(params) => <TextField {...params} label="Харьяалал" />}
                onChange={(e) => {
                  setConsigneeNatinality(e.target.textContent.substring(1, 3));
                }}
              />
              <TextField
                label="Нэр"
                size="small"
                value={consigneeNm}
                onChange={(e) => {
                  setConsigneeNm(e.target.value);
                }}
              />
              <TextField
                label="Регистр №"
                size="small"
                value={consigneeReg}
                onChange={(e) => {
                  setConsigneeReg(e.target.value);
                }}
              />
              <TextField
                label="Утасны дугаар"
                size="small"
                value={consigneeTel}
                onChange={(e) => {
                  setConsigneeTel(e.target.value);
                }}
              />
              <TextField
                variant="standard"
                label="Хаяг"
                size="small"
                style={{ width: 550 }}
                value={consigneeAddr}
                onChange={(e) => {
                  setConsigneeAddr(e.target.value);
                }}
              /> */}
            </Grid>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );

  return content;
};

export default NewPackageeForm;
