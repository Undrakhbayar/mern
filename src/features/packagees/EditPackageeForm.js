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
  FormLabel,
  Radio,
  RadioGroup,
  Modal,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
  const [price2, setPrice2] = useState("");
  const [price2Curr, setPrice2Curr] = useState("");
  const [price3, setPrice3] = useState("");
  const [price3Curr, setPrice3Curr] = useState("");
  const [price4, setPrice4] = useState("");
  const [price4Curr, setPrice4Curr] = useState("");
  const [price5, setPrice5] = useState("");
  const [price5Curr, setPrice5Curr] = useState("");
  const [transportType, setTransportType] = useState(packagee.transportType);
  const [transportTypeI, setTransportTypeI] = useState(packagee.transportType);
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
  const [compName, setCompName] = useState(packagee.compName);
  const [compRegister, setCompRegister] = useState(packagee.compRegister);
  const [compAddr, setCompAddr] = useState(packagee.compAddr);
  const [compTel, setCompTel] = useState(packagee.compTel);
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

      console.log(transportTypes.find((o) => o.value === transportType));
      setTransportTypeI(transportTypes.find((o) => o.value === transportType));
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
        mailDate,
        ecommerceType,
        ecommerceLink,
      });
    }
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const content = (
    <Box
      component="form"
      onSubmit={onSavePackageeClicked}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
    >
      {packagee.prgsStatusCd === "10" ? (
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
      ) : (
        <></>
      )}
      <Grid container spacing={1} columns={26} sx={{ boxShadow: 3, pr: 1, pb: 1 }} alignItems="center">
        <Grid item xs={26}>
          <Paper variant="outlined">
            <Typography variant="h6" m={2}>
              Үндсэн мэдээлэл
            </Typography>
            {isError ? <Alert severity="error">{error?.data?.message}</Alert> : <></>}
            {isErrorA ? <Alert severity="error">{errorA?.data?.message}</Alert> : <></>}
            <TextField
              //error={houseSeq.length != 3}
              //helperText={!houseSeq.length ? "name is " : ""}
              style={{ width: 70 }}
              value={houseSeq}
              label="№"
              size="small"
              inputProps={{ maxLength: 3 }}
              onChange={(e) => {
                setHouseSeq(e.target.value);
              }}
            />
            <TextField
              value={mailId}
              style={{ width: 200 }}
              label="Илгээмжийн дугаар"
              size="small"
              onChange={(e) => {
                setMailId(e.target.value);
              }}
            />
            <TextField
              value={mailBagNumber}
              style={{ width: 160 }}
              label="Богцын дугаар"
              size="small"
              onChange={(e) => {
                setMailBagNumber(e.target.value);
              }}
            />
            <TextField
              value={blNo}
              label="Тээврийн баримтын дугаар"
              size="small"
              onChange={(e) => {
                setBlNo(e.target.value);
              }}
            />
            <TextField
              value={riskType}
              style={{ width: 190 }}
              label="Эрсдлийн төлөв /үнэлгээ/ "
              size="small"
              onChange={(e) => {
                setRiskType(e.target.value);
              }}
            />
            {/*             <Autocomplete
              size="small"
              style={{
                display: "inline-flex",
                width: 200,
              }}
              fullWidth={false}
              value={reportType}
              options={reportTypes.map((option) => option.value)}
              renderInput={(params) => <TextField {...params} label="Маягтын төрөл" />}
              onChange={(e) => {
                setReportType(e.target.textContent);
              }}
            /> */}

            <Autocomplete
              size="small"
              id="combo-box-demo"
              style={{
                display: "inline-flex",
                width: 220,
              }}
              fullWidth={false}
              options={transportTypes}
              value={transportTypeI}
              getOptionLabel={(option) => (option.description ? option.description : "")}
              //getOptionLabel={option => option.description}
              //isOptionEqualToValue={(option, value) => option.value === value}
              renderInput={(params) => <TextField {...params} label="Шуудангын төрөл" />}
              onChange={(e, newValue) => {
                setTransportType(newValue ? newValue.value : "");
              }}
            />
            <FormControl>
              <FormLabel id="diplomat">Дипломат эсэх</FormLabel>
              <RadioGroup
                row
                aria-labelledby="diplomat"
                onChange={(e) => {
                  setIsDiplomat(e.target.value);
                }}
                value={isDiplomat}
              >
                <FormControlLabel value="Y" control={<Radio />} label="Тийм" />
                <FormControlLabel value="N" control={<Radio />} label="Үгүй" />
              </RadioGroup>
            </FormControl>
            {/*             <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ачаа хөдөлсөн огноо"
                format="YYYY-MM-DD"
                value="2023-03-14"
                onChange={(e) => {
                  setMailDate(e.format("YYYY-MM-DD").toString());
                }}
                slotProps = {{ textField: { variant: 'standard', size: 'small' } }}
              />
            </LocalizationProvider> */}
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
            {/*             <Autocomplete
              size="small"
              style={{
                display: "inline-flex",
              }}
              fullWidth={false}
              value={shipperNatinality}
              options={countries.map((option) => "[" + option.value + "] " + option.description)}
              renderInput={(params) => <TextField {...params} label="Харьяалал" />}
              onChange={(e) => {
                setShipperNatinality(e.target.textContent.substring(1, 3));
              }}
            /> */}
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
              label="Хаяг"
              size="small"
              value={shipperAddr}
              onChange={(e) => {
                setShipperAddr(e.target.value);
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
            {/*             <Autocomplete
              size="small"
              style={{
                display: "inline-flex",
              }}
              fullWidth={false}
              value={consigneeNatinality}
              options={countries.map((option) => "[" + option.value + "] " + option.description)}
              renderInput={(params) => <TextField {...params} label="Харьяалал" />}
              onChange={(e) => {
                setConsigneeNatinality(e.target.textContent.substring(1, 3));
              }}
            /> */}
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
              label="Хаяг"
              size="small"
              value={consigneeAddr}
              onChange={(e) => {
                setConsigneeAddr(e.target.value);
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
        <Grid item xs={26}></Grid>
      </Grid>
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
                  value={transFareCurr}
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
                  value={price1Curr}
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
          sx={{ boxShadow: 2 }}
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
  );

  return content;
};

export default EditPackageeForm;
