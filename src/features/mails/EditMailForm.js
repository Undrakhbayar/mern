import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateMailMutation, useAddNewMailMutation } from "./mailsApiSlice";
import { useGetItemsQuery, useAddNewItemMutation } from "./itemsApiSlice";
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
  FormControlLabel,
  FormControl,
  FormGroup,
  Radio,
  RadioGroup,
  Modal,
  ThemeProvider,
  Container,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import Subject from "@mui/icons-material/Subject";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GreenRedSwitch, CustomInput, CustomFormLabel, theme, style } from "../../components/Components";
import dayjs from "dayjs";
import { REFERENCE_URL } from "../../config/common";

const EditMailForm = ({ mail, users }) => {
  const navigate = useNavigate();
  const {
    data: items,
    isLoandig: isLoadingList,
    isSuccess: isSuccessList,
    isError: isErrorList,
    error: errorList,
  } = useGetItemsQuery(mail.id, {
    pollingInterval: 1000000,
    /*     refetchOnFocus: true,
    refetchOnMountOrArgChange: true, */
  });
  const columns = [
    {
      field: "goodsNm",
      headerName: "Барааны нэр",
      width: 150,
    },
    {
      field: "netWgt",
      headerName: "Цэвэр жин",
      type: "number",
      width: 110,
    },
    {
      field: "delYn",
      headerName: "Төлөв",
      width: 120,
    },
  ];
  const [pageSize, setPageSize] = useState(10);
  const [selection, setSelection] = useState([]);
  let rows = [];
  if (isSuccessList) {
    console.log(items);
    const { entities } = items;
    rows = Object.values(entities);
  }

  const [mailId, setMailId] = useState(mail.mailId ? mail.mailId : "");
  const [mailBagNumber] = useState(mail.mailBagNumber ? mail.mailBagNumber : "");
  const [blNo] = useState(mail.blNo);
  const [reportType, setReportType] = useState(mail.reportType?mail.reportType:"");
  const [riskType, setRiskType] = useState(mail.riskType?mail.riskType:"");
  const [transportType, setTransportType] = useState(mail.transportType?mail.transportType:"");
  const [transportTypeNm, setTransportTypeNm] = useState(mail.transportTypeNm?mail.transportTypeNm:"");
  const [isDiplomat, setIsDiplomat] = useState(mail.isDiplomat?mail.isDiplomat:"");
  const [shipperCntryCd, setShipperCntryCd] = useState(mail.shipperCntryCd?mail.shipperCntryCd:"");
  const [shipperCntryNm, setShipperCntryNm] = useState(mail.shipperCntryNm);
  const [shipperNatinality, setShipperNatinality] = useState(mail.shipperNatinality);
  const [shipperNatinalityNm, setShipperNatinalityNm] = useState("");
  const [shipperNatinalityObject] = useState({ type: "country", code: mail.shipperNatinality, name: mail.shipperNatinalityNm });
  const [shipperNm, setShipperNm] = useState(mail.shipperNm);
  const [shipperReg, setShipperReg] = useState(mail.shipperReg);
  const [shipperAddr, setShipperAddr] = useState(mail.shipperAddr);
  const [shipperTel, setShipperTel] = useState(mail.shipperTel);
  const [shipperEmail, setShipperEmail] = useState(mail.shipperEmail);
  const [consigneeCntryCd, setConsigneeCntryCd] = useState(mail.consigneeCntryCd);
  const [consigneeCntryNm, setConsigneeCntryNm] = useState(mail.consigneeCntryNm);
  const [consigneeNatinality, setConsigneeNatinality] = useState(mail.consigneeNatinality);
  const [consigneeNatinalityNm, setConsigneeNatinalityNm] = useState("");
  const [consigneeNatinalityObject] = useState({ type: "country", code: mail.consigneeNatinality, name: mail.consigneeNatinalityNm });
  const [consigneeNm, setConsigneeNm] = useState(mail.consigneeNm);
  const [consigneeReg, setConsigneeReg] = useState(mail.consigneeReg);
  const [consigneeAddr, setConsigneeAddr] = useState(mail.consigneeAddr);
  const [consigneeTel, setConsigneeTel] = useState(mail.consigneeTel);
  const [consigneeEmail, setConsigneeEmail] = useState(mail.consigneeEmail);
  const [mailDate, setMailDate] = useState(mail.mailDate);
  const [area, setArea] = useState(mail.area);
  const [areaNm, setAreaNm] = useState(mail.areaNm);
  const [branch, setBranch] = useState(mail.branch);
  const [branchNm, setBranchNm] = useState(mail.branchNm);
  const [consigneePayYn, setConsigneePayYn] = useState(mail.consigneePayYn);
  const [mailType, setMailType] = useState(mail.mailType);
  const [mailTypeNm, setMailTypeNm] = useState(mail.mailTypeNm);
  const [serviceType, setServiceType] = useState(mail.serviceType);
  const [serviceTypeNm, setServiceTypeNm] = useState(mail.serviceTypeNm);
  const [mailWgt, setMailWgt] = useState(mail.mailWgt);
  const [mainPrice, setMainPrice] = useState(mail.mainPrice);
  const [regPrice, setRegPrice] = useState(mail.regPrice);
  const [addPrice, setAddPrice] = useState(mail.addPrice);
  const [tax, setTax] = useState(mail.tax);
  const [addWgtPrice, setAddWgtPrice] = useState(mail.addWgtPrice);
  const [sumPrice, setSumPrice] = useState(mail.sumPrice);

  const [netWgt, setNetWgt] = useState("");
  const [wgt, setWgt] = useState("");
  const [qty, setQty] = useState("");
  const [qtyUnit, setQtyUnit] = useState("");
  const [dangGoodsCode, setDangGoodsCode] = useState("");
  const [transFare, setTransFare] = useState("");
  const [transFareCurr, setTransFareCurr] = useState("");
  const [price1, setPrice1] = useState("");
  const [price1Curr, setPrice1Curr] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [goodsNm, setGoodsNm] = useState("");
  const [ecommerceType, setEcommerceType] = useState("");
  const [ecommerceLink, setEcommerceLink] = useState("");

  const [userId, setUserId] = useState(users[0].id);
  const [reportTypes, setReportTypes] = useState([]);
  const [transportTypes, setTransportTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [areas, setAreas] = useState([]);
  const [branches, setBranches] = useState([]);
  const [mailTypes, setMailTypes] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);

  const referenceUrl = REFERENCE_URL;
  const [updateMail, { isLoading, isSuccess, isError, error }] = useUpdateMailMutation();
  const [addNewMail, { isLoading: isLoadingA, isSuccess: isSuccessA, isError: isErrorA, error: errorA }] = useAddNewMailMutation();
  const [addNewItem, { isLoading: isLoadingItem, isSuccess: isSuccessItem, isError: isErrorItem, error: errorItem }] = useAddNewItemMutation();

  const goList = () => {
    navigate("/dash/mails");
  };

  useEffect(() => {
    if (isSuccess || isSuccessA) {
      setUserId("");
      localStorage.removeItem("path");
      navigate("/dash/mails");
    }
  }, [isSuccess, isSuccessA, navigate]);

  useEffect(() => {
    if (isSuccessItem) {
      handleClose();
    }
  }, [isSuccessItem]);

  console.log(localStorage.getItem("path"));

  useEffect(() => {
    const getReferences = async () => {
      const res = await fetch(referenceUrl + `?compreg=${mail.compRegister}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      const reportTypes = response.filter(({ type }) => type === "reportType");
      const transportTypes = response.filter(({ type }) => type === "transportType");
      const countries = response.filter(({ type }) => type === "country");
      const areas = response.filter(({ type }) => type === "area");
      const branches = response.filter(({ type }) => type === "branch");
      const mailTypes = response.filter(({ type }) => type === "mailType");
      const serviceTypes = response.filter(({ type }) => type === "serviceType");

      setReportTypes(reportTypes);
      setTransportTypes(transportTypes);
      setCountries(countries);
      setAreas(areas);
      setBranches(branches);
      setMailTypes(mailTypes);
      setServiceTypes(serviceTypes);
      console.log(areas);
    };
    getReferences();
  }, [referenceUrl, mail.compRegister]);

  const canSave = [userId].every(Boolean) && !isLoading && !isLoadingA && !isLoadingItem;

  const onSaveMailClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      if (localStorage.getItem("path") === "copy") {
        await addNewMail({
          user: userId,
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
          transportType,
          transportTypeNm,
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
          mailDate,
          ecommerceType,
          ecommerceLink,
        });
      } else {
        await updateMail({
          id: mail.id,
          user: userId,
          prgsStatusCd: "10",
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
          transportType,
          transportTypeNm,
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
          mailDate,
          ecommerceType,
          ecommerceLink,
        });
      }
    }
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onSaveItemClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewItem({
        mailId: mail.id,
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
        /*         price2,
        price2Curr,
        price3,
        price3Curr,
        price4,
        price4Curr,
        price5,
        price5Curr, */
        isDiplomat,
        hsCode,
        goodsNm,
        mailDate,
        ecommerceType,
        ecommerceLink,
      });
    }
  };
  const content = (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl">
        <Box component="form" onSubmit={onSaveMailClicked}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 1 }}>
            {mail.prgsStatusCd === "10" ? (
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
            ) : (
              <></>
            )}
            <Button
              sx={{
                bgcolor: "#6366F1",
                ":hover": { bgcolor: "#4338CA" },
              }}
              variant="contained"
              endIcon={<Subject />}
              onClick={goList}
              size="small"
            >
              Жагсаалт
            </Button>
          </Stack>
          <Paper sx={{ pl: 2, py: 3 }}>
            <Grid container columns={12}>
              <Grid item xs={12}>
                <Typography variant="h6" color="#4338CA" sx={{ mb: 2, mx: 2, pb: 1, borderBottom: 2, borderColor: "#4338CA", fontWeight: 700 }}>
                  Үндсэн мэдээлэл
                </Typography>
                {isError ? <Alert severity="error">{error?.data?.message}</Alert> : <></>}
                {isErrorA ? <Alert severity="error">{errorA?.data?.message}</Alert> : <></>}
              </Grid>
              <Grid item xs={2}>
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
                        format="YYYY-MM-DD"
                        value={dayjs(mailDate)}
                        onChange={(e) => setMailDate(e.format("YYYY-MM-DD"))}
                        slotProps={{ textField: { size: "small" } }}
                        sx={{ mx: 2, mb: 1 }}
                      />
                    </LocalizationProvider>
                    <CustomFormLabel name="Бүртгэлийн үнэ" />
                    <CustomInput
                      value={regPrice}
                      onChange={(e) => {
                        setRegPrice(e.target.value);
                      }}
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack>
                  <FormControl>
                    <CustomFormLabel name="Маягтын төрөл" />
                    <Select
                      size="small"
                      sx={{ mx: 2, mb: 1 }}
                      value={reportType}
                      onChange={(e) => {
                        setReportType(e.target.value);
                      }}
                    >
                      {reportTypes.map((option, index) => (
                        <MenuItem key={index} value={option.code}>
                          {option.code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <CustomFormLabel name="Тээврийн төрөл" />
                    <Select
                      size="small"
                      sx={{ mx: 2, mb: 1 }}
                      value={transportType}
                      onChange={(e, child) => {
                        setTransportType(e.target.value);
                        setTransportTypeNm(child.props.children);
                      }}
                    >
                      {transportTypes.map((option, index) => (
                        <MenuItem key={index} value={option.code}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <CustomFormLabel name="Нэмэлт үйлчилгээний үнэ" />
                  <CustomInput
                    value={addPrice}
                    onChange={(e) => {
                      setAddPrice(e.target.value);
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack>
                  <FormControl>
                    <CustomFormLabel name="Хамрах хүрээ" required />
                    <Select
                      size="small"
                      sx={{ mx: 2, mb: 1 }}
                      value={area}
                      onChange={(e, child) => {
                        setArea(e.target.value);
                        setAreaNm(child.props.children);
                      }}
                    >
                      {areas.map((option, index) => (
                        <MenuItem key={index} value={option.code}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <CustomFormLabel name="Хүлээн авах салбар" />
                    <Select
                      size="small"
                      sx={{ mx: 2, mb: 1 }}
                      value={branch}
                      onChange={(e, child) => {
                        setBranch(e.target.value);
                        setBranchNm(child.props.children);
                      }}
                    >
                      {branches.map((option, index) => (
                        <MenuItem key={index} value={option.code}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <CustomFormLabel name="Татвар" />
                    <CustomInput
                      value={tax}
                      onChange={(e) => {
                        setTax(e.target.value);
                      }}
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack>
                  <FormControl>
                    <CustomFormLabel name="Шуудангийн төрөл" />
                    <Select
                      size="small"
                      sx={{ mx: 2, mb: 1 }}
                      value={mailType}
                      onChange={(e, child) => {
                        setMailType(e.target.value);
                        setMailTypeNm(child.props.children);
                      }}
                    >
                      {mailTypes.map((option, index) => (
                        <MenuItem key={index} value={option.code}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <CustomFormLabel name="Үйлчилгээний төрөл" />
                    <Select
                      size="small"
                      sx={{ mx: 2, mb: 1 }}
                      value={serviceType}
                      onChange={(e, child) => {
                        setServiceType(e.target.value);
                        setServiceTypeNm(child.props.children);
                      }}
                    >
                      {serviceTypes.map((option, index) => (
                        <MenuItem key={index} value={option.code}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <CustomFormLabel name="Илүү жингийн үнэ" />
                    <CustomInput
                      value={addWgtPrice}
                      onChange={(e) => {
                        setAddWgtPrice(e.target.value);
                      }}
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack>
                  <FormControl>
                    <CustomFormLabel name="Жин" />
                    <CustomInput
                      value={mailWgt}
                      onChange={(e) => {
                        setMailWgt(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">KG</InputAdornment>,
                      }}
                    />
                    <CustomFormLabel name="Үндсэн үнэ" />
                    <CustomInput
                      value={mainPrice}
                      onChange={(e) => {
                        setMainPrice(e.target.value);
                      }}
                    />
                    <CustomFormLabel name="Нийт үнэ" />
                    <CustomInput
                      value={sumPrice}
                      onChange={(e) => {
                        setSumPrice(e.target.value);
                      }}
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={2}>
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
                            sx={{ mx: 2, mb: 1 }}
                            checked={riskType === "green" ? true : false}
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
                      sx={{ mx: 2, mb: 1 }}
                      onChange={(e) => {
                        setIsDiplomat(e.target.value);
                      }}
                    >
                      <FormControlLabel value="Y" control={<Radio checked={isDiplomat === "Y" ? true : false} />} label="Тийм" />
                      <FormControlLabel value="N" control={<Radio checked={isDiplomat === "N" ? true : false} />} label="Үгүй" />
                    </RadioGroup>
                    <CustomFormLabel name="Хүлээн авагч төлөх" />
                    <RadioGroup
                      row
                      defaultValue="N"
                      sx={{ mx: 2, mb: 1 }}
                      onChange={(e) => {
                        setConsigneePayYn(e.target.value);
                      }}
                    >
                      <FormControlLabel value="Y" control={<Radio checked={consigneePayYn === "Y" ? true : false} />} label="Тийм" />
                      <FormControlLabel value="N" control={<Radio checked={consigneePayYn === "Y" ? true : false} />} label="Үгүй" />
                    </RadioGroup>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="#4338CA" sx={{ mb: 2, mt: 3, mx: 2, pb: 1, borderBottom: 2, borderColor: "#4338CA", fontWeight: 700 }}>
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
                    fullWidth={false}
                    sx={{ mx: 2, mb: 1 }}
                    options={countries}
                    value={shipperNatinalityObject}
                    getOptionLabel={(option) => `${option.code}-${option.name}`}
                    isOptionEqualToValue={(option, value) => option.code === value.code}
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(e, newValue) => {
                      setShipperNatinality(newValue ? newValue.code : "");
                      setShipperNatinalityNm(newValue ? newValue.name : "");
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
                  <CustomFormLabel name="Имэйл" />
                  <CustomInput
                    value={shipperEmail}
                    onChange={(e) => {
                      setShipperEmail(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="#4338CA" sx={{ mb: 2, mx: 2, mt: 3, pb: 1, borderBottom: 2, borderColor: "#4338CA", fontWeight: 700 }}>
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
                    fullWidth={false}
                    sx={{ mx: 2, mb: 1 }}
                    options={countries}
                    value={consigneeNatinalityObject}
                    getOptionLabel={(option) => `${option.code} - ${option.name}`}
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(e, newValue) => {
                      setConsigneeNatinality(newValue ? newValue.code : "");
                      setConsigneeNatinalityNm(newValue ? newValue.name : "");
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
                  <CustomFormLabel name="Имэйл" />
                  <CustomInput
                    value={consigneeEmail}
                    onChange={(e) => {
                      setConsigneeEmail(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
          {mail.prgsStatusCd === "10" ? (
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ m: 1 }}>
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
                Бараа нэмэх
              </Button>
              <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                  <Paper variant="outlined">
                    <Grid container columns={11}>
                      <Grid item xs={11}>
                        <Typography variant="h6" m={2}>
                          Барааны мэдээлэл
                        </Typography>
                      </Grid>
                      <Grid item xs={11}>
                        <TextField
                          label="Барааны нэр"
                          style={{ width: 400 }}
                          size="small"
                          value={goodsNm}
                          onChange={(e) => {
                            setGoodsNm(e.target.value);
                          }}
                        />
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
                          <CustomFormLabel name="Баглаа боодлын тоо" />
                          <CustomInput
                            value={qty}
                            onChange={(e) => {
                              setQty(e.target.value);
                            }}
                          />
                          <CustomFormLabel name="Баглаа боодлын нэгж" />
                          <CustomInput
                            value={qtyUnit}
                            onChange={(e) => {
                              setQtyUnit(e.target.value);
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
                          <CustomFormLabel name="Үнэ" />
                          <CustomInput
                            value={price1}
                            onChange={(e) => {
                              setPrice1(e.target.value);
                            }}
                          />
                          <CustomFormLabel name="Үнэ валют" />
                          <CustomInput
                            value={price1Curr}
                            onChange={(e) => {
                              setPrice1Curr(e.target.value);
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
                          <CustomFormLabel name="Цахим худалдааны төлбөрийн баримтын хуулбар" />
                          <CustomInput
                            value={ecommerceType}
                            onChange={(e) => {
                              setEcommerceType(e.target.value);
                            }}
                          />
                          <CustomFormLabel name="Цахим худалдааны линк" />
                          <CustomInput
                            value={ecommerceLink}
                            onChange={(e) => {
                              setEcommerceLink(e.target.value);
                            }}
                          />
                        </Stack>
                        {/*                    <TextField
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
                      value={price2Curr}
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
                      value={price3Curr}
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
                      value={price4Curr}
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
                      value={price5Curr}
                      onChange={(e) => {
                        setPrice5Curr(e.target.value);
                      }}
                    /> */}
                      </Grid>
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
                      onClick={onSaveItemClicked}
                    >
                      Хадгалах
                    </Button>
                  </Stack>
                </Box>
              </Modal>
            </Stack>
          ) : (
            <></>
          )}

          <div style={{ height: 400 }}>
            <DataGrid
              sx={{ boxShadow: 2, bgcolor: "#fff" }}
              rows={rows}
              //onRowSelectionModelChange={setSelection}
              {...rows}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[10, 20, 30]}
              checkboxSelection
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
              density="compact"
              getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
            />
          </div>
        </Box>
      </Container>
    </ThemeProvider>
  );

  return content;
};

export default EditMailForm;
