import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdatePackageeMutation, useAddNewPackageeMutation } from "./packageesApiSlice";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import Subject from "@mui/icons-material/Subject";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GreenRedSwitch, CustomInput, CustomFormLabel, theme, style } from "../../components/Components";
import dayjs from "dayjs";

const EditPackageeForm = ({ packagee, users }) => {
  const navigate = useNavigate();
  const {
    data: items,
    isLoandig: isLoadingList,
    isSuccess: isSuccessList,
    isError: isErrorList,
    error: errorList,
  } = useGetItemsQuery(packagee.id, {
    pollingInterval: 1000000,
    /*     refetchOnFocus: true,
    refetchOnMountOrArgChange: true, */
  });
  const columns = [
    {
      field: "houseSeq",
      headerName: "№",
      width: 60,
    },
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

  const [houseSeq, setHouseSeq] = useState(packagee.houseSeq);
  const [mailId, setMailId] = useState(packagee.mailId);
  const [mailBagNumber, setMailBagNumber] = useState(packagee.mailBagNumber);
  const [blNo, setBlNo] = useState(packagee.blNo);
  const [reportType, setReportType] = useState(packagee.reportType);
  const [riskType, setRiskType] = useState(packagee.riskType);
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
/*   const [price2, setPrice2] = useState("");
  const [price2Curr, setPrice2Curr] = useState("");
  const [price3, setPrice3] = useState("");
  const [price3Curr, setPrice3Curr] = useState("");
  const [price4, setPrice4] = useState("");
  const [price4Curr, setPrice4Curr] = useState("");
  const [price5, setPrice5] = useState("");
  const [price5Curr, setPrice5Curr] = useState(""); */
  const [transportType, setTransportType] = useState(packagee.transportType);
  const [transportTypeObject] = useState({ type: "transportType", value: packagee.transportType, description: packagee.transportTypeNm });
  console.log(transportTypeObject);
  const [transportTypeNm, setTransportTypeNm] = useState(packagee.transportTypeNm);
  const [isDiplomat, setIsDiplomat] = useState(packagee.isDiplomat);
  const [hsCode, setHsCode] = useState("");
  const [goodsNm, setGoodsNm] = useState("");
  const [shipperCntryCd, setShipperCntryCd] = useState(packagee.shipperCntryCd);
  const [shipperCntryNm, setShipperCntryNm] = useState(packagee.shipperCntryNm);
  const [shipperNatinality, setShipperNatinality] = useState(packagee.shipperNatinality);
  const [shipperNm, setShipperNm] = useState(packagee.shipperNm);
  const [shipperReg, setShipperReg] = useState(packagee.shipperReg);
  const [shipperAddr, setShipperAddr] = useState(packagee.shipperAddr);
  const [shipperTel, setShipperTel] = useState(packagee.shipperTel);
  const [consigneeCntryCd, setConsigneeCntryCd] = useState(packagee.consigneeCntryCd);
  const [consigneeCntryNm, setConsigneeCntryNm] = useState(packagee.consigneeCntryNm);
  const [consigneeNatinality, setConsigneeNatinality] = useState(packagee.consigneeNatinality);
  const [consigneeNm, setConsigneeNm] = useState(packagee.consigneeNm);
  const [consigneeReg, setConsigneeReg] = useState(packagee.consigneeReg);
  const [consigneeAddr, setConsigneeAddr] = useState(packagee.consigneeAddr);
  const [consigneeTel, setConsigneeTel] = useState(packagee.consigneeTel);
  const [mailDate, setMailDate] = useState(packagee.mailDate);
  const [ecommerceType, setEcommerceType] = useState("");
  const [ecommerceLink, setEcommerceLink] = useState("");

  const [userId, setUserId] = useState(users[0].id);
  const [reportTypes, setReportTypes] = useState([]);
  const [transportTypes, setTransportTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isDiplomats, setIsDiplomats] = useState([]);

  const [updatePackagee, { isLoading, isSuccess, isError, error }] = useUpdatePackageeMutation();
  const [addNewPackagee, { isLoading: isLoadingA, isSuccess: isSuccessA, isError: isErrorA, error: errorA }] = useAddNewPackageeMutation();
  const [addNewItem, { isLoading: isLoadingItem, isSuccess: isSuccessItem, isError: isErrorItem, error: errorItem }] = useAddNewItemMutation();

  const goList = () => {
    navigate("/dash/packagees");
  };

  useEffect(() => {
    if (isSuccess || isSuccessA) {
      setUserId("");
      localStorage.removeItem("path");
      navigate("/dash/packagees");
    }
  }, [isSuccess, isSuccessA, navigate]);

  useEffect(() => {
    if (isSuccessItem) {
      handleClose();
    }
  }, [isSuccessItem]);

  console.log(localStorage.getItem("path"));
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

  const canSave = [userId].every(Boolean) && !isLoading && !isLoadingA && !isLoadingItem;

  const onSavePackageeClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      if (localStorage.getItem("path") === "copy") {
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
        await updatePackagee({
          id: packagee.id,
          user: userId,
          prgsStatusCd: "10",
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
        packageeId: packagee.id,
        houseSeq,
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
        <Box component="form" onSubmit={onSavePackageeClicked}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 1 }}>
            {packagee.prgsStatusCd === "10" ? (
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
          <Paper sx={{ pl: 2, pb: 3 }}>
            <Grid container columns={12}>
              <Grid item xs={12}>
                <Typography variant="h6" m={2}>
                  Үндсэн мэдээлэл
                </Typography>
                {isError ? <Alert severity="error">{error?.data?.message}</Alert> : <></>}
                {isErrorA ? <Alert severity="error">{errorA?.data?.message}</Alert> : <></>}
              </Grid>
              <Grid item xs={4}>
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
                      value={reportType}
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
                      value={transportTypeObject}
                      freeSolo
                      getOptionLabel={(option) => option.description}
                      renderInput={(params) => <TextField variant="outlined" {...params} />}
                      onChange={(e, newValue) => {
                        setTransportType(newValue ? newValue.value : "");
                        setTransportTypeNm(newValue ? newValue.description : "");
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
                      aria-labelledby="demo-row-radio-buttons-group-label"
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
            </Grid>
          </Paper>
          {packagee.prgsStatusCd === "10" ? (
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
              initialState={{ pinnedColumns: { left: ["houseSeq"], right: ["actions"] } }}
            />
          </div>
        </Box>
      </Container>
    </ThemeProvider>
  );

  return content;
};

export default EditPackageeForm;
