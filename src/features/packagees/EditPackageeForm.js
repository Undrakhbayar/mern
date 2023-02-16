import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdatePackageeMutation, useDeletePackageeMutation } from "./packageesApiSlice"
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";

const EditPackageeForm = ({ packagee, users }) => {

  const navigate = useNavigate();
  const [houseSeq, setHouseSeq] = useState(packagee.houseSeq)
  const [mailId, setMailId] = useState(packagee.mailId);
  const [blNo, setBlNo] = useState(packagee.blNo);
  const [riskType, setRiskType] = useState(packagee.riskType);
  const [reportType, setReportType] = useState(packagee.reportType);
  const [netWgt, setNetWgt] = useState(packagee.netWgt);
  const [wgt, setWgt] = useState(packagee.wgt);
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
  const [shipperNm, setShipperNm] = useState(packagee.shipperNm);
  const [consigneeCntryNm, setConsigneeCntryNm] = useState(packagee.consigneeCntryNm);
  const [consigneeNm, setConsigneeNm] = useState(packagee.consigneeNm);
  const [consigneeReg, setConsigneeReg] = useState(packagee.consigneeReg);
  const [consigneeTel, setConsigneeTel] = useState(packagee.consigneeTel);
  const [compName, setCompName] = useState(packagee.compName);
  const [compRegister, setCompRegister] = useState(packagee.compRegister);
  const [compAddr, setCompAddr] = useState(packagee.compAddr);
  const [compTel, setCompTel] = useState(packagee.compTel);
  const [userId, setUserId] = useState(users[0].id);
  const [reportTypes, setReportTypes] = useState([]);

  const [updatePackagee, {
    isLoading,
    isSuccess,
    isError,
    error
}] = useUpdatePackageeMutation()

  useEffect(() => {
    if (isSuccess) {
      setHouseSeq(packagee.houseSeq);
      setUserId(packagee.houseSeq);
      navigate("/dash/packagees");
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    const getReportTypes = async () => {
      const res = await fetch("http://localhost:3500/reportTypes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();
      setReportTypes(response);
    };
    getReportTypes();
  }, []);

  const canSave = [houseSeq, userId].every(Boolean) && !isLoading;

  const onSavePackageeClicked = async (e) => {
    if (canSave) {
        await updatePackagee({ id: packagee.id, user: userId })
    }
}

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const errClass = isError ? "errmsg" : "offscreen";

  const content = (
    <Box
      component="form"
      onSubmit={onSavePackageeClicked}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mb: 2 }}
      >
        <Button variant="contained" endIcon={<SaveIcon />} type="submit">
          Хадгалах
        </Button>
      </Stack>
      <Grid container spacing={1} columns={16} sx={{ boxShadow: 3 }}>
        <Grid item>
          <div>
            {isError ? <Alert severity="error">{error?.data?.message}</Alert> : <></>}
            <TextField
              //error={houseSeq.length != 3}
              //helperText={!houseSeq.length ? "name is " : packagee.houseSeq}
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
              label="Илгээмжийн дугаар"
              size="small"
              onChange={(e) => {
                setMailId(e.target.value);
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
              id="outlined-select-currency"
              select
              label="Маягтын төрөл"
              size="small"
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
              }}
            >
              {reportTypes.map((option) => (
                <MenuItem key={option.type} value={option.type}>
                  {option.type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              value={riskType}
              label="Эрсдлийн төлөв /үнэлгээ/ "
              size="small"
              onChange={(e) => {
                setRiskType(e.target.value);
              }}
            />
            <TextField
              label="Цэвэр жин"
              id="outlined-start-adornment"
              size="small"
              value={netWgt}
              onChange={(e) => {
                setNetWgt(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">KG</InputAdornment>
                ),
              }}
            />
            <TextField
              label="Бохир жин"
              id="outlined-start-adornment"
              size="small"
              value={wgt}
              onChange={(e) => {
                setWgt(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">KG</InputAdornment>
                ),
              }}
            />
            <TextField
              label="Баглаа боодлын тоо"
              size="small"
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
              }}
            />
            <TextField
              label="Баглаа боодлын нэгж"
              size="small"
              value={qtyUnit}
              onChange={(e) => {
                setQtyUnit(e.target.value);
              }}
            />
            <TextField
              label="Аюултай барааны код"
              size="small"
              value={dangGoodsCode}
              onChange={(e) => {
                setDangGoodsCode(e.target.value);
              }}
            />
            <TextField
              label="Тээврийн зардал үнэ"
              size="small"
              value={transFare}
              onChange={(e) => {
                setTransFare(e.target.value);
              }}
            />
            <TextField
              label="Тээврийн зардал валют"
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setTransFareCurr(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 1"
              size="small"
              value={price1}
              onChange={(e) => {
                setPrice1(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 1 валют"
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setPrice1Curr(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 2"
              size="small"
              value={price2}
              onChange={(e) => {
                setPrice2(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 2 валют"
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setPrice2Curr(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 3"
              size="small"
              value={price3}
              onChange={(e) => {
                setPrice3(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 3 валют"
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setPrice3Curr(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 4"
              size="small"
              value={price4}
              onChange={(e) => {
                setPrice4(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 4 валют"
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setPrice4Curr(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 5"
              size="small"
              value={price5}
              onChange={(e) => {
                setPrice5(e.target.value);
              }}
            />
            <TextField
              label="Үнэ 5 валют"
              size="small"
              defaultValue={"USD"}
              onChange={(e) => {
                setPrice5Curr(e.target.value);
              }}
            />
            <TextField
              label="Шуудангын төрөл"
              size="small"
              defaultValue={"40"}
              value={transportType}
              onChange={(e) => {
                setTransportType(e.target.value);
              }}
            />
            <TextField
              label="Дипломат эсэх"
              size="small"
              defaultValue={"N"}
              onChange={(e) => {
                setIsDiplomat(e.target.value);
              }}
            />
            <TextField
              label="БТКУС код"
              size="small"
              value={hsCode}
              onChange={(e) => {
                setHsCode(e.target.value);
              }}
            />
            <TextField
              label="Барааны нэр"
              size="small"
              value={goodsNm}
              onChange={(e) => {
                setGoodsNm(e.target.value);
              }}
            />
            <TextField
              label="Илгээгч нэр"
              size="small"
              value={shipperNm}
              onChange={(e) => {
                setShipperNm(e.target.value);
              }}
            />
            <TextField
              label="Хүлээн авагч улс хот нэр"
              size="small"
              value={consigneeCntryNm}
              onChange={(e) => {
                setConsigneeCntryNm(e.target.value);
              }}
            />
            <TextField
              label="Хүлээн авагч нэр"
              size="small"
              value={consigneeNm}
              onChange={(e) => {
                setConsigneeNm(e.target.value);
              }}
            />
            <TextField
              label="Хүлээн авагч Регистр №"
              size="small"
              value={consigneeReg}
              onChange={(e) => {
                setConsigneeReg(e.target.value);
              }}
            />
            <TextField
              label="Хүлээн авагч Утасны дугаар"
              size="small"
              value={consigneeTel}
              onChange={(e) => {
                setConsigneeTel(e.target.value);
              }}
            />
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
          </div>
        </Grid>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid>
      </Grid>
    </Box>
  );

  return content;
};

export default EditPackageeForm;
