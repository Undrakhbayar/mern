import * as React from "react";
import { useState, useEffect } from "react";
import {
  useGetPackageesQuery,
  useDeletePackageeMutation,
} from "./packageesApiSlice";
import Packagee from "./Packagee";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import MailIcon from "@mui/icons-material/Mail";
import Stack from "@mui/material/Stack";
const PackageesList = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "houseSeq",
      headerName: "№",
      headerClassName: "",
      width: 150,
      editable: true,
    },
    {
      field: "mailId",
      headerName: "Илгээмжийн Дугаар",
      width: 150,
      editable: true,
    },
    {
      field: "blNo",
      headerName: "Тээврийн баримтын дугаар",
      width: 150,
      editable: true,
    },
    {
      field: "netWgt",
      headerName: "Цэвэр жин",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];
  const {
    data: packagees,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPackageesQuery("packageesList", {
    pollingInterval: 150000,
    /*     refetchOnFocus: true,
    refetchOnMountOrArgChange: true, */
  });

  const { username, isManager, isAdmin } = useAuth();

  const navigate = useNavigate();
  const onNewPackageeClicked = () => navigate("/dash/packagees/new");

  const [
    deletePackagee,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeletePackageeMutation();

  useEffect(() => {
    if (isDelSuccess) {
      navigate("/dash/packagees");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onDeletePackageesClicked = async () => {
    await deletePackagee({ id: selection });
  };
  let rows = [];

  const [selection, setSelection] = useState([]);

  if (isSuccess) {
    const { ids, entities } = packagees;
    rows = Object.values(entities);
    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (packageeId) => entities[packageeId].username === username
      );
    }
  }

  const onSendPackageesClicked = async () => {
    const selectedRowsData = selection.map((id) =>
      rows.find((row) => row.id === id)
    );
    console.log(selectedRowsData);
    let arr = [];

    for (let i = 0; i < selectedRowsData.length; i++) {
      let obj = new Object();
      obj.HOUSE_SEQ = selectedRowsData[i].houseSeq;
      obj.MAIL_ID = selectedRowsData[i].mailId;
      obj.MAIL_BAG_NUMBER = selectedRowsData[i].mailBagNumber;
      obj.BL_NO = selectedRowsData[i].blNo;
      obj.REPORT_TYPE = selectedRowsData[i].reportType;
      obj.RISK_TYPE = selectedRowsData[i].riskType;
      obj.NET_WGT = selectedRowsData[i].netWgt;
      obj.WGT = selectedRowsData[i].wgt;
      obj.WGT_UNIT = selectedRowsData[i].wgtUnit;
      obj.QTY = selectedRowsData[i].qty;
      obj.QTY_UNIT = selectedRowsData[i].qtyUnit;
      obj.DANG_GOODS_CODE = selectedRowsData[i].dangGoodsCode;
      obj.TRANS_FARE = selectedRowsData[i].transFare;
      obj.TRANS_FARE_CURR = selectedRowsData[i].transFareCurr;
      obj.PRICE1 = selectedRowsData[i].price1;
      obj.PRICE_CURR1 = selectedRowsData[i].priceCurr1;
      obj.PRICE2 = selectedRowsData[i].price2;
      obj.PRICE_CURR2 = selectedRowsData[i].priceCurr2;
      obj.PRICE3 = selectedRowsData[i].price3;
      obj.PRICE_CURR3 = selectedRowsData[i].priceCurr3;
      obj.PRICE4 = selectedRowsData[i].price4;
      obj.PRICE_CURR4 = selectedRowsData[i].priceCurr4;
      obj.PRICE5 = selectedRowsData[i].price5;
      obj.PRICE_CURR5 = selectedRowsData[i].priceCurr5;
      obj.TRANSPORT_TYPE = selectedRowsData[i].transportType;
      obj.IS_DIPLOMAT = selectedRowsData[i].isDiplomat;
      obj.HSCODE = selectedRowsData[i].hsCode;
      obj.GOODS_NM = selectedRowsData[i].goodsNm;
      obj.SHIPPER_CNTRY_CD = selectedRowsData[i].shipperCntryCd;
      obj.SHIPPER_CNTRY_NM = selectedRowsData[i].shipperCntryNm;
      obj.SHIPPER_NATINALITY = selectedRowsData[i].shipperNatinality;
      obj.SHIPPER_NM = selectedRowsData[i].shipperNm;
      obj.SHIPPER_REG = selectedRowsData[i].shipperReg;
      obj.SHIPPER_ADDR = selectedRowsData[i].shipperAddr;
      obj.SHIPPER_TEL = selectedRowsData[i].shipperTel;
      obj.CONSIGNEE_CNTRY_CD = selectedRowsData[i].consigneeCntryCd;
      obj.CONSIGNEE_CNTRY_NM = selectedRowsData[i].consigneeCntryNm;
      obj.CONSIGNEE_NATINALITY = selectedRowsData[i].consigneeNatinality;
      obj.CONSIGNEE_NM = selectedRowsData[i].consigneeNm;
      obj.CONSIGNEE_REG = selectedRowsData[i].consigneeReg;
      obj.CONSIGNEE_ADDR = selectedRowsData[i].consigneeAddr;
      obj.CONSIGNEE_TEL = selectedRowsData[i].consigneeTel;
      obj.COMP_NAME = selectedRowsData[i].compName;
      obj.COMP_REGISTER = selectedRowsData[i].compRegister;
      obj.COMP_ADDR = selectedRowsData[i].compAddr;
      obj.COMP_TEL = selectedRowsData[i].compTel;
      obj.REG_DATE = selectedRowsData[i].regDate;
      obj.MAIL_DATE = selectedRowsData[i].mailDate;
      obj.ECOMMERCE_TYPE = selectedRowsData[i].ecommerceType;
      obj.ECOMMERCE_LINK = selectedRowsData[i].ecommerceLink;

      arr.push(obj);
    }

    let jsonString = JSON.stringify(arr);
    console.log(jsonString);
    const res = await fetch("https://api.gaali.mn/ceps/send/cargo/short", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonString,
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  const content = (
    <Box sx={{ height: 400, width: "100%" }}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mb: 2 }}
      >
        <Button
          variant="outlined"
          startIcon={<SendIcon />}
          onClick={onSendPackageesClicked}
        >
          Илгээх
        </Button>
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={onDeletePackageesClicked}
        >
          Устгах
        </Button>
        <Button
          variant="contained"
          endIcon={<MailIcon />}
          onClick={onNewPackageeClicked}
        >
          Нэмэх
        </Button>
      </Stack>
      <DataGrid
        sx={{ boxShadow: 2 }}
        rows={rows}
        onSelectionModelChange={setSelection}
        {...rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
      />
    </Box>
  );
  return content;
};
export default PackageesList;
