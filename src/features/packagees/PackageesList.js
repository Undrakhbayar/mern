import * as React from "react";
import { useState, useEffect } from "react";
import {
  useGetPackageesQuery,
  useDeletePackageeMutation,
  useUpdatePackageeMutation,
} from "./packageesApiSlice";
import Packagee from "./Packagee";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import {
  DataGrid,
  gridClasses,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import MailIcon from "@mui/icons-material/Mail";
import Stack from "@mui/material/Stack";
import { alpha, styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Link from "@mui/material/Link";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

const PackageesList = () => {
  const columns = [
    {
      field: "id",
      headerName: "number",
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.id)+1,
    },
    {
      field: "houseSeq",
      headerName: "№",
      headerClassName: "",
      width: 60,
    },
    {
      field: "mailId",
      headerName: "Илгээмжийн Дугаар",
      width: 150,
      renderCell: (params) => {
        return (
          <Link href={`/dash/packagees/${params.row.id}`}>
            {params.row.mailId}
          </Link>
        );
      },
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
    {
      field: "prgsStatusCd",
      headerName: "Төлөв",
      width: 110,
      editable: true,
    },
    {
      field: "edit",
      headerName: "Засах",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key={0}
          icon={<EditIcon color="primary" />}
          label="Засах"
          onClick={() => handleEdit(params)}
        />,
      ],
    },
  ];
  const handleEdit = (id) => navigate(`/dash/packagees/${id}`);
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
      await updatePackagee({
        id: selectedRowsData[i].id,
        mailId: selectedRowsData[i].mailId,
        blNo: selectedRowsData[i].blNo,
        prgsStatusCd: "11",
      });
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

  const [prgsStatusCd, setPrgsStatusCd] = useState([]);
  const [updatePackagee, { isLoadingU, isSuccessU, isErrorU, errorU }] =
    useUpdatePackageeMutation();

  useEffect(() => {
    if (isSuccessU) {
      setPrgsStatusCd("");
    }
  }, [isSuccessU]);

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
          color="success"
        >
          Илгээх
        </Button>
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={onDeletePackageesClicked}
          color="error"
        >
          Устгах
        </Button>
        <Button
          variant="outlined"
          endIcon={<MailIcon />}
          onClick={onNewPackageeClicked}
        >
          Нэмэх
        </Button>
      </Stack>
      <StripedDataGrid
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
