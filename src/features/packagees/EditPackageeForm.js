import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdatePackageeMutation, useAddNewPackageeMutation } from "./packageesApiSlice";
import { Box, Paper, Grid, TextField, Button, Stack, InputAdornment, Alert, Typography, Autocomplete } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const EditPackageeForm = ({ packagee, users }) => {
  const navigate = useNavigate();
  console.log(packagee);
  const [houseSeq, setHouseSeq] = useState(packagee.houseSeq);
  const [mailId, setMailId] = useState(packagee.mailId);
  const [mailBagNumber, setMailBagNumber] = useState(packagee.mailBagNumber);
  const [blNo, setBlNo] = useState(packagee.blNo);
  const [reportType, setReportType] = useState(packagee.reportType);
  const [riskType, setRiskType] = useState(packagee.riskType);
  const [netWgt, setNetWgt] = useState(packagee.netWgt);
  const [wgt, setWgt] = useState(packagee.wgt);
  //const [wgtUnit, setWgtUnit] = useState("KG");
  const [qty, setQty] = useState(packagee.qty);
  const [qtyUnit, setQtyUnit] = useState(packagee.qtyUnit);
  const [dangGoodsCode, setDangGoodsCode] = useState(packagee.dangGoodsCode);
  const [transFare, setTransFare] = useState(packagee.transFare);
  const [transFareCurr, setTransFareCurr] = useState(packagee.transFareCurr);
  const [price1, setPrice1] = useState(packagee.price1);
  const [price1Curr, setPrice1Curr] = useState(packagee.price1Curr);
  const [price2, setPrice2] = useState(packagee.price2);
  const [price2Curr, setPrice2Curr] = useState(packagee.price2Curr);
  const [price3, setPrice3] = useState(packagee.price3);
  const [price3Curr, setPrice3Curr] = useState(packagee.price3Curr);
  const [price4, setPrice4] = useState(packagee.price4);
  const [price4Curr, setPrice4Curr] = useState(packagee.price4Curr);
  const [price5, setPrice5] = useState(packagee.price5);
  const [price5Curr, setPrice5Curr] = useState(packagee.price5Curr);
  const [transportType, setTransportType] = useState(packagee.transportType);
  const [isDiplomat, setIsDiplomat] = useState(packagee.isDiplomat);
  const [hsCode, setHsCode] = useState(packagee.hsCode);
  const [goodsNm, setGoodsNm] = useState(packagee.goodsNm);
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
  const [ecommerceType, setEcommerceType] = useState(packagee.ecommerceType);
  const [ecommerceLink, setEcommerceLink] = useState(packagee.ecommerceLink);

  const [userId, setUserId] = useState(users[0].id);
  const [reportTypes, setReportTypes] = useState([]);
  const [transportTypes, setTransportTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isDiplomats, setIsDiplomats] = useState([]);

  const [updatePackagee, { isLoading, isSuccess, isError, error }] = useUpdatePackageeMutation();
  const [addNewPackagee, { isLoading: isLoadingA, isSuccess: isSuccessA, isError: isErrorA, error: errorA }] = useAddNewPackageeMutation();

  useEffect(() => {
    if (isSuccess || isSuccessA) {
      setUserId("");
      localStorage.removeItem("path");
      navigate("/dash/packagees");
    }
  }, [isSuccess, isSuccessA, navigate]);

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

  const canSave = [houseSeq, userId].every(Boolean) && !isLoading && !isLoadingA;

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
          prgsStatusCd : '10',
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

  const content = (
    <Box
      component="form"
      onSubmit={onSavePackageeClicked}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
    >
      { packagee.prgsStatusCd === '10' ?
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
          ????????????????
        </Button>
      </Stack>
      :<></>
      }
      <Grid container spacing={1} columns={26} sx={{ boxShadow: 3, pr: 1, pb: 1 }} alignItems="center">
        <Grid item xs={26}>
          <Paper variant="outlined">
            <Typography variant="h6" m={2}>
              ???????????? ????????????????
            </Typography>
            {isError ? <Alert severity="error">{error?.data?.message}</Alert> : <></>}
            {isErrorA ? <Alert severity="error">{errorA?.data?.message}</Alert> : <></>}
            <TextField
              //error={houseSeq.length != 3}
              //helperText={!houseSeq.length ? "name is " : ""}
              style={{ width: 70 }}
              value={houseSeq}
              label="???"
              size="small"
              inputProps={{ maxLength: 3 }}
              onChange={(e) => {
                setHouseSeq(e.target.value);
              }}
            />
            <TextField
              value={mailId}
              style={{ width: 200 }}
              label="???????????????????? ????????????"
              size="small"
              onChange={(e) => {
                setMailId(e.target.value);
              }}
            />
            <TextField
              value={mailBagNumber}
              style={{ width: 160 }}
              label="???????????? ????????????"
              size="small"
              onChange={(e) => {
                setMailBagNumber(e.target.value);
              }}
            />
            <TextField
              value={blNo}
              label="???????????????? ???????????????? ????????????"
              size="small"
              onChange={(e) => {
                setBlNo(e.target.value);
              }}
            />
            <TextField
              value={riskType}
              style={{ width: 190 }}
              label="???????????????? ?????????? /??????????????/ "
              size="small"
              onChange={(e) => {
                setRiskType(e.target.value);
              }}
            />
            <Autocomplete
              size="small"
              style={{
                display: "inline-flex",
                width: 200,
              }}
              fullWidth={false}
              value={reportType}
              options={reportTypes.map((option) => option.value)}
              renderInput={(params) => <TextField {...params} label="?????????????? ??????????" />}
              onChange={(e) => {
                setReportType(e.target.textContent);
              }}
            />

            <Autocomplete
              size="small"
              id="combo-box-demo"
              style={{
                display: "inline-flex",
                width: 220,
              }}
              value={transportType}
              fullWidth={false}
              options={transportTypes.map((option) => "[" + option.value + "] " + option.description)}
              renderInput={(params) => <TextField {...params} label="?????????????????? ??????????" />}
              onChange={(e) => {
                setTransportType(e.target.textContent.substring(1, 3));
              }}
            />
            <Autocomplete
              size="small"
              style={{
                display: "inline-flex",
                width: 140,
              }}
              value={isDiplomat}
              fullWidth={false}
              options={isDiplomats.map((option) => "[" + option.value + "] " + option.description)}
              renderInput={(params) => <TextField {...params} label="???????????????? ????????" />}
              onChange={(e) => {
                setIsDiplomat(e.target.textContent.substring(1, 2));
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="???????? ???????????????? ??????????"
                inputFormat="YYYY-MM-DD"
                value={mailDate}
                onChange={(e) => {
                  setMailDate(e.format("YYYY-MM-DD").toString());
                }}
                renderInput={(params) => <TextField size="small" style={{ width: 180 }} {...params} />}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>
        <Grid item xs={10}>
          <Paper variant="outlined" style={{ margin: "auto" }}>
            <Typography variant="h6" m={2}>
              ???????????????????? ????????????????
            </Typography>
            <TextField
              label="?????? ?????????? ??????"
              size="small"
              value={shipperCntryCd}
              onChange={(e) => {
                setShipperCntryCd(e.target.value);
              }}
            />
            <TextField
              label="?????? ?????????? ??????"
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
              value={shipperNatinality}
              options={countries.map((option) => "[" + option.value + "] " + option.description)}
              renderInput={(params) => <TextField {...params} label="??????????????????" />}
              onChange={(e) => {
                setShipperNatinality(e.target.textContent.substring(1, 3));
              }}
            />
            <TextField
              label="??????"
              size="small"
              value={shipperNm}
              onChange={(e) => {
                setShipperNm(e.target.value);
              }}
            />
            <TextField
              label="?????????????? ???"
              size="small"
              value={shipperReg}
              onChange={(e) => {
                setShipperReg(e.target.value);
              }}
            />
            <TextField
              label="????????"
              size="small"
              value={shipperAddr}
              onChange={(e) => {
                setShipperAddr(e.target.value);
              }}
            />
            <TextField
              label="???????????? ????????????"
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
              ???????????? ???????????????? ????????????????
            </Typography>
            <TextField
              label="?????? ?????????? ??????"
              size="small"
              value={consigneeCntryCd}
              onChange={(e) => {
                setConsigneeCntryCd(e.target.value);
              }}
            />
            <TextField
              label="?????? ?????????? ??????"
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
              value={consigneeNatinality}
              options={countries.map((option) => "[" + option.value + "] " + option.description)}
              renderInput={(params) => <TextField {...params} label="??????????????????" />}
              onChange={(e) => {
                setConsigneeNatinality(e.target.textContent.substring(1, 3));
              }}
            />
            <TextField
              label="??????"
              size="small"
              value={consigneeNm}
              onChange={(e) => {
                setConsigneeNm(e.target.value);
              }}
            />
            <TextField
              label="?????????????? ???"
              size="small"
              value={consigneeReg}
              onChange={(e) => {
                setConsigneeReg(e.target.value);
              }}
            />
            <TextField
              label="????????"
              size="small"
              value={consigneeAddr}
              onChange={(e) => {
                setConsigneeAddr(e.target.value);
              }}
            />
            <TextField
              label="???????????? ????????????"
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
              ?????????????????????? ????????????????
            </Typography>
            <TextField
              label="??????"
              size="small"
              value={compName}
              onChange={(e) => {
                setCompName(e.target.value);
              }}
            />
            <TextField
              label="?????????????? ???"
              size="small"
              value={compRegister}
              onChange={(e) => {
                setCompRegister(e.target.value);
              }}
            />
            <TextField
              label="????????"
              size="small"
              value={compAddr}
              onChange={(e) => {
                setCompAddr(e.target.value);
              }}
            />
            <TextField
              label="???????????? ????????????"
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
              ?????????????? ????????????????
            </Typography>
            <TextField
              label="?????????????? ??????"
              style={{ width: 400 }}
              size="small"
              value={goodsNm}
              onChange={(e) => {
                setGoodsNm(e.target.value);
              }}
            />
            <TextField
              label="?????????? ??????"
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
              label="?????????? ??????"
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
              label="???????????? ?????????????? ??????"
              style={{ width: 160 }}
              size="small"
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
              }}
            />
            <TextField
              label="???????????? ?????????????? ????????"
              style={{ width: 170 }}
              size="small"
              value={qtyUnit}
              onChange={(e) => {
                setQtyUnit(e.target.value);
              }}
            />
            <TextField
              label="???????????????? ???????????? ??????"
              style={{ width: 170 }}
              size="small"
              value={transFare}
              onChange={(e) => {
                setTransFare(e.target.value);
              }}
            />
            <TextField
              label="???????????????? ???????????? ??????????"
              style={{ width: 180 }}
              size="small"
              value={transFareCurr}
              onChange={(e) => {
                setTransFareCurr(e.target.value);
              }}
            />
            <TextField
              label="?????? 1"
              style={{ width: 125 }}
              size="small"
              value={price1}
              onChange={(e) => {
                setPrice1(e.target.value);
              }}
            />
            <TextField
              label="?????? 1 ??????????"
              style={{ width: 125 }}
              size="small"
              value={price1Curr}
              onChange={(e) => {
                setPrice1Curr(e.target.value);
              }}
            />
            <TextField
              label="?????? 2"
              style={{ width: 125 }}
              size="small"
              value={price2}
              onChange={(e) => {
                setPrice2(e.target.value);
              }}
            />
            <TextField
              label="?????? 2 ??????????"
              style={{ width: 125 }}
              size="small"
              value={price2Curr}
              onChange={(e) => {
                setPrice2Curr(e.target.value);
              }}
            />
            <TextField
              label="?????? 3"
              style={{ width: 125 }}
              size="small"
              value={price3}
              onChange={(e) => {
                setPrice3(e.target.value);
              }}
            />
            <TextField
              label="?????? 3 ??????????"
              style={{ width: 125 }}
              size="small"
              value={price3Curr}
              onChange={(e) => {
                setPrice3Curr(e.target.value);
              }}
            />
            <TextField
              label="?????? 4"
              style={{ width: 125 }}
              size="small"
              value={price4}
              onChange={(e) => {
                setPrice4(e.target.value);
              }}
            />
            <TextField
              label="?????? 4 ??????????"
              style={{ width: 125 }}
              size="small"
              value={price4Curr}
              onChange={(e) => {
                setPrice4Curr(e.target.value);
              }}
            />
            <TextField
              label="?????? 5"
              style={{ width: 125 }}
              size="small"
              value={price5}
              onChange={(e) => {
                setPrice5(e.target.value);
              }}
            />
            <TextField
              label="?????? 5 ??????????"
              style={{ width: 125 }}
              size="small"
              value={price5Curr}
              onChange={(e) => {
                setPrice5Curr(e.target.value);
              }}
            />
            <TextField
              label="?????????? ??????"
              style={{ width: 125 }}
              size="small"
              value={hsCode}
              onChange={(e) => {
                setHsCode(e.target.value);
              }}
            />
            <TextField
              label="?????????????? ?????????????? ??????"
              style={{ width: 125 }}
              size="small"
              value={dangGoodsCode}
              onChange={(e) => {
                setDangGoodsCode(e.target.value);
              }}
            />
            <TextField
              label="?????????? ???????????????????? ?????????????????? ???????????????? ??????????????"
              size="small"
              style={{ width: 400 }}
              value={ecommerceType}
              onChange={(e) => {
                setEcommerceType(e.target.value);
              }}
            />
            <TextField
              label="?????????? ???????????????????? ????????"
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

export default EditPackageeForm;
