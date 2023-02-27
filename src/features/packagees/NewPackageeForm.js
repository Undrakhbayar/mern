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
  InputAdornment,
  Alert,
  Typography,
  Autocomplete,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GreenRedSwitch, CustomInput } from "../../components/Components";

const NewPackageeForm = ({ users }) => {
  const [addNewPackagee, { isLoading, isSuccess, isError, error }] = useAddNewPackageeMutation();

  const navigate = useNavigate();

  const [houseSeq, setHouseSeq] = useState("");
  const [mailId, setMailId] = useState("");
  const [mailBagNumber, setMailBagNumber] = useState("");
  const [blNo, setBlNo] = useState("");
  const [reportType, setReportType] = useState("");
  const [riskType, setRiskType] = useState("");
  const [netWgt, setNetWgt] = useState("");
  const [wgt, setWgt] = useState("");
  //const [wgtUnit, setWgtUnit] = useState("KG");
  const [qty, setQty] = useState("");
  const [qtyUnit, setQtyUnit] = useState("");
  const [dangGoodsCode, setDangGoodsCode] = useState("");
  const [transFare, setTransFare] = useState("");
  const [transFareCurr, setTransFareCurr] = useState("");
  const [price1, setPrice1] = useState("");
  const [price1Curr, setPrice1Curr] = useState("");
  const [price2, setPrice2] = useState("");
  const [price2Curr, setPrice2Curr] = useState("");
  const [price3, setPrice3] = useState("");
  const [price3Curr, setPrice3Curr] = useState("");
  const [price4, setPrice4] = useState("");
  const [price4Curr, setPrice4Curr] = useState("");
  const [price5, setPrice5] = useState("");
  const [price5Curr, setPrice5Curr] = useState("");
  const [transportType, setTransportType] = useState("");
  const [isDiplomat, setIsDiplomat] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [goodsNm, setGoodsNm] = useState("");
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
  const [compName, setCompName] = useState("");
  const [compRegister, setCompRegister] = useState("");
  const [compAddr, setCompAddr] = useState("");
  const [compTel, setCompTel] = useState("");
  const [mailDate, setMailDate] = useState(dayjs(new Date()));
  const [ecommerceType, setEcommerceType] = useState("");
  const [ecommerceLink, setEcommerceLink] = useState("");

  const [userId, setUserId] = useState(users[0].id);
  const [reportTypes, setReportTypes] = useState([]);
  const [transportTypes, setTransportTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isDiplomats, setIsDiplomats] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      setHouseSeq("");
      setUserId("");
      navigate("/dash/packagees");
    }
  }, [isSuccess, navigate]);

  const referenceUrl = "http://localhost:3500/references";
  //const referenceUrl = "https://mern-api-lcmj.onrender.com/references";
  useEffect(() => {
    const getReferences = async () => {
      const res = await fetch(referenceUrl + "?reportType", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      const reportTypes = response.filter(({ type }) => type === "reportType");
      const transportTypes = response.filter(({ type }) => type === "transportType");
      const countries = response.filter(({ type }) => type === "country");
      const isDiplomats = response.filter(({ type }) => type === "diplomat");

      setReportTypes(reportTypes);
      setTransportTypes(transportTypes);
      setCountries(countries);
      setIsDiplomats(isDiplomats);
    };
    getReferences();
  }, []);

  const canSave = [houseSeq, userId].every(Boolean) && !isLoading;

  const onSavePackageeClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewPackagee({
        user: userId,
        houseSeq,
        mailId,
        mailBagNumber,
        blNo,
        reportType,
        riskType,
        netWgt,
        wgt,
        //wgtUnit,
        qty,
        qtyUnit,
        dangGoodsCode,
        transFare,
        transFareCurr,
        price1,
        price1Curr,
        price2,
        price2Curr,
        price3,
        price3Curr,
        price4,
        price4Curr,
        price5,
        price5Curr,
        transportType,
        isDiplomat,
        hsCode,
        goodsNm,
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
        ecommerceType,
        ecommerceLink,
      });
    }
  };

  //const errClass = isError ? "errmsg" : "offscreen";
  const label = { inputProps: { "aria-label": "Color switch demo" } };
  const content = (
    <Box
      component="form"
      onSubmit={onSavePackageeClicked}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          sx={{
            bgcolor: "#6366F1",
            ":hover": { bgcolor: "#4338CA" },
          }}
          variant="contained"
          endIcon={<SaveIcon />}
          type="submit"
        >
          Хадгалах
        </Button>
      </Stack>
      <Grid container spacing={1} columns={26} sx={{ boxShadow: 3, pr: 1, pb: 1 }} alignItems="center">
        <Grid item xs={26}>
          <Paper elevation={3}>
            <Typography variant="h6" m={2}>
              Үндсэн мэдээлэл
            </Typography>
            {isError ? <Alert severity="error">{error?.data?.message}</Alert> : <></>}
            <CustomInput
              style={{ width: 50 }}
              value={houseSeq}
              label="№"
              inputProps={{ maxLength: 3 }}
              onChange={(e) => {
                setHouseSeq(e.target.value);
              }}
            />
            <CustomInput
              value={mailId}
              style={{ width: 175 }}
              label="Илгээмжийн дугаар"
              onChange={(e) => {
                setMailId(e.target.value);
              }}
            />
            <CustomInput
              value={mailBagNumber}
              style={{ width: 135 }}
              label="Богцын дугаар"
              onChange={(e) => {
                setMailBagNumber(e.target.value);
              }}
            />
            <CustomInput
              value={blNo}
              style={{ width: 240 }}
              label="Тээврийн баримтын дугаар"
              onChange={(e) => {
                setBlNo(e.target.value);
              }}
            />
            {/*             <TextField
              variant="standard"
              value={riskType}
              style={{ width: 190 }}
              label="Эрсдлийн төлөв /үнэлгээ/ "
              size="small"
              onChange={(e) => {
                setRiskType(e.target.value);
              }}
            /> */}
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
                      //console.log(e.target.checked);
                      e.target.checked ? setRiskType("green") : setRiskType("red");
                    }}
                  />
                }
                label="Эрсдлийн төлөв"
              />
            </FormGroup>
            <Autocomplete
              size="small"
              style={{
                display: "inline-flex",
                width: 175,
              }}
              fullWidth={false}
              options={reportTypes.map((option) => option.value)}
              renderInput={(params) => <TextField variant="standard" {...params} label="Маягтын төрөл" />}
              onChange={(e) => {
                setReportType(e.target.textContent);
              }}
            />

            <Autocomplete
              size="small"
              style={{
                display: "inline-flex",
                width: 200,
              }}
              fullWidth={false}
              options={transportTypes.map((option) => "[" + option.value + "] " + option.description)}
              renderInput={(params) => <TextField variant="standard" {...params} label="Шуудангын төрөл" />}
              onChange={(e) => {
                setTransportType(e.target.textContent.substring(1, 3));
              }}
            />
{/*             <Autocomplete
              size="small"
              style={{
                display: "inline-flex",
                width: 165,
              }}
              fullWidth={false}
              options={isDiplomats.map((option) => "[" + option.value + "] " + option.description)}
              renderInput={(params) => <TextField variant="standard" {...params} label="Дипломат эсэх" />}
              onChange={(e) => {
                setIsDiplomat(e.target.textContent.substring(1, 2));
              }}
            /> */}
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">Дипломат эсэх</FormLabel>
              <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                <FormControlLabel value="Y" control={<Radio />} label="Тийм" />
                <FormControlLabel value="N" control={<Radio />} label="Үгүй" />
              </RadioGroup>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                variant="standard"
                label="Ачаа хөдөлсөн огноо"
                inputFormat="YYYY-MM-DD"
                value={mailDate}
                onChange={(e) => {
                  setMailDate(e);
                }}
                renderInput={(params) => <TextField variant="standard" size="small" style={{ width: 140 }} {...params} />}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>
        <Grid item xs={10}>
          <Paper variant="outlined" style={{ margin: "auto" }}>
            <Typography variant="h6" m={2}>
              Илгээгчийн мэдээлэл
            </Typography>
            <TextField
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
          </Paper>
        </Grid>
        <Grid item xs={10}>
          <Paper variant="outlined">
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
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper variant="outlined">
            <Typography variant="h6" m={2}>
              Зуучлагчийн мэдээлэл
            </Typography>
            <TextField
              label="Нэр"
              size="small"
              value={compName}
              onChange={(e) => {
                setCompName(e.target.value);
              }}
            />
            <TextField
              label="Регистр №"
              size="small"
              value={compRegister}
              onChange={(e) => {
                setCompRegister(e.target.value);
              }}
            />
            <TextField
              label="Хаяг"
              size="small"
              value={compAddr}
              onChange={(e) => {
                setCompAddr(e.target.value);
              }}
            />
            <TextField
              label="Утасны дугаар"
              size="small"
              value={compTel}
              onChange={(e) => {
                setCompTel(e.target.value);
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={26}>
          <Paper variant="outlined">
            <Typography variant="h6" m={2}>
              Барааны мэдээлэл
            </Typography>
            <TextField
              label="Барааны нэр"
              style={{ width: 400 }}
              size="small"
              value={goodsNm}
              onChange={(e) => {
                setGoodsNm(e.target.value);
              }}
            />
            <TextField
              label="Цэвэр жин"
              style={{ width: 170 }}
              size="small"
              value={netWgt}
              onChange={(e) => {
                setNetWgt(e.target.value);
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">KG</InputAdornment>,
              }}
            />
            <TextField
              label="Бохир жин"
              style={{ width: 170 }}
              size="small"
              value={wgt}
              onChange={(e) => {
                setWgt(e.target.value);
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">KG</InputAdornment>,
              }}
            />
            <TextField
              label="Баглаа боодлын тоо"
              style={{ width: 160 }}
              size="small"
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
              }}
            />
            <TextField
              label="Баглаа боодлын нэгж"
              style={{ width: 170 }}
              size="small"
              value={qtyUnit}
              onChange={(e) => {
                setQtyUnit(e.target.value);
              }}
            />
            <TextField
              label="Тээврийн зардал үнэ"
              style={{ width: 170 }}
              size="small"
              value={transFare}
              onChange={(e) => {
                setTransFare(e.target.value);
              }}
            />
            <TextField
              label="Тээврийн зардал валют"
              style={{ width: 180 }}
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setTransFareCurr(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 1"
              style={{ width: 125 }}
              size="small"
              value={price1}
              onChange={(e) => {
                setPrice1(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 1 валют"
              style={{ width: 125 }}
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setPrice1Curr(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 2"
              style={{ width: 125 }}
              size="small"
              value={price2}
              onChange={(e) => {
                setPrice2(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 2 валют"
              style={{ width: 125 }}
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setPrice2Curr(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 3"
              style={{ width: 125 }}
              size="small"
              value={price3}
              onChange={(e) => {
                setPrice3(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 3 валют"
              style={{ width: 125 }}
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setPrice3Curr(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 4"
              style={{ width: 125 }}
              size="small"
              value={price4}
              onChange={(e) => {
                setPrice4(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 4 валют"
              style={{ width: 125 }}
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setPrice4Curr(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 5"
              style={{ width: 125 }}
              size="small"
              value={price5}
              onChange={(e) => {
                setPrice5(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 5 валют"
              style={{ width: 125 }}
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setPrice5Curr(e.target.value);
              }}
            />
            <TextField
              label="БТКУС код"
              style={{ width: 125 }}
              size="small"
              value={hsCode}
              onChange={(e) => {
                setHsCode(e.target.value);
              }}
            />
            <TextField
              label="Аюултай барааны код"
              style={{ width: 125 }}
              size="small"
              value={dangGoodsCode}
              onChange={(e) => {
                setDangGoodsCode(e.target.value);
              }}
            />
            <TextField
              label="Цахим худалдааны төлбөрийн баримтын хуулбар"
              size="small"
              style={{ width: 400 }}
              value={ecommerceType}
              onChange={(e) => {
                setEcommerceType(e.target.value);
              }}
            />
            <TextField
              label="Цахим худалдааны линк"
              style={{ width: 600 }}
              size="small"
              value={ecommerceLink}
              onChange={(e) => {
                setEcommerceLink(e.target.value);
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  return content;
};

export default NewPackageeForm;
