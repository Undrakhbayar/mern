import * as React from "react";
import { useState, useEffect } from "react";
import { useGetMailsQuery, useDeleteMailMutation, useUpdateMailMutation, useSendMailMutation } from "./mailsApiSlice";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Link, Alert } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { alpha, styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import MailIcon from "@mui/icons-material/Mail";
import EditIcon from "@mui/icons-material/Edit";
import CopyIcon from "@mui/icons-material/ContentCopy";
import { OrderStatus } from "../../components/Components";
import { useAddNewMailMutation } from "./mailsApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import gridDefaultLocaleText from "../../components/LocalTextConstants";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const MailsList = () => {
  const columns = [
    /*     {
      field: "id",
      headerName: "number",
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    }, */
    {
      field: "houseSeq",
      headerName: "№",
      width: 60,
    },
    {
      field: "mailId",
      headerName: "Илгээмжийн дугаар",
      width: 170,
      renderCell: (params) => {
        return <Link href={`/dash/mails/${params.row.id}`}>{params.row.mailId}</Link>;
      },
    },
    {
      field: "blNo",
      headerName: "Тээврийн баримтын дугаар",
      width: 150,
    },
    {
      field: "netWgt",
      headerName: "Цэвэр жин",
      type: "number",
      width: 110,
    },
    /*     {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params) => `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    }, */
    {
      field: "prgsStatusCd",
      headerName: "Төлөв",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: function render({ row }) {
        return <OrderStatus status={row.prgsStatusCd} />;
      },
    },
    {
      field: "transportType",
      headerName: "Шуудангийн төрөл",
      width: 110,
    },
    {
      field: "actions",
      headerName: "Засах",
      sortable: false,
      type: "actions",
      getActions: ({ row }) => [
        <GridActionsCellItem
          key={1}
          icon={<EditIcon />}
          sx={{ padding: "2px 6px" }}
          label="Засах"
          disabled={row.prgsStatusCd === "11"}
          onClick={() => {
            handleEdit(row.id);
          }}
        />,
        <GridActionsCellItem
          key={2}
          icon={<DeleteIcon />}
          sx={{ padding: "2px 6px" }}
          label="Устгах"
          disabled={row.prgsStatusCd === "11"}
          onClick={() => {
            handleDelete(row);
          }}
        />,
      ],
    },
    {
      field: "delYn",
      headerName: "Төлөв",
      width: 120,
    },
  ];
  const handleEdit = (id) => navigate(`/dash/mails/${id}`);
  const handleDelete = async (id) => {
    await deleteMail({ id: [id] });
  };
  const {
    data: mails,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMailsQuery("mailsList", {
    pollingInterval: 1000000,
    /*     refetchOnFocus: true,
    refetchOnMountOrArgChange: true, */
  });
  let content;

  if (isError) {
    content = <Alert severity="error">{error?.data?.message}</Alert>;
  }

  if (isLoading) content = <p>Loading...</p>;
  const { username, isManager, isAdmin, compregister } = useAuth();

  const navigate = useNavigate();
  const onNewMailClicked = () => navigate("/dash/mails/new");

  const [deleteMail, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] = useDeleteMailMutation();
  const [sendMail, { isSuccess: isSendSuccess, isError: isSendError, error: sendError }] = useSendMailMutation();

  useEffect(() => {
    if (isDelSuccess) {
      navigate(0);
    }
  }, [isDelSuccess, navigate]);

  const onDeleteMailsClicked = async () => {
    await deleteMail({ id: selection });
  };
  const onCopyMailsClicked = async () => {
    localStorage.setItem("path", "copy");
    navigate(`/dash/mails/${selection}`);
  };
  let unfiltered = [];
  let rows = [];
  const [pageSize, setPageSize] = useState(10);
  const [selection, setSelection] = useState([]);

  if (isSuccess) {
    const { entities } = mails;

    unfiltered = Object.values(entities);
    if (isManager || isAdmin) {
      rows = unfiltered.filter(({ compRegister }) => compRegister === compregister);
    } else {
      rows = unfiltered.filter(({ regusername }) => regusername === username);
    }
  }

  const onSendMailsClicked = async () => {
    /*const selectedRowsData = selection.map((id) => rows.find((row) => row.id === id));
    console.log(selectedRowsData);
    let arr = [];

    for (let i = 0; i < selectedRowsData.length; i++) {
       let obj = {};
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
      await updateMail({
        id: selectedRowsData[i].id,
        mailId: selectedRowsData[i].mailId,
        blNo: selectedRowsData[i].blNo,
        prgsStatusCd: "11",
      });
    }

    let jsonString = JSON.stringify(arr);
    console.log(jsonString);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonString,
    };
    const res = await fetch("https://api.gaali.mn/ceps/send/cargo/short", requestOptions)
      .then((res) => res.json())
      .then((res) => console.log(res)); */
    const selectedRowsData = selection.map((id) => rows.find((row) => row.id === id));
    console.log(selectedRowsData);
    let arr = [];

    for (let i = 0; i < selectedRowsData.length; i++) {
      let obj = {};
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

      let jsonString = JSON.stringify(arr);
      console.log(jsonString);
      await sendMail({ jsonString });

      await updateMail({
        id: selectedRowsData[i].id,
        mailId: selectedRowsData[i].mailId,
        blNo: selectedRowsData[i].blNo,
        prgsStatusCd: "11",
      });
    }
  };

  const [prgsStatusCd, setPrgsStatusCd] = useState([]);
  const [updateMail, { isLoadingU, isSuccessU, isErrorU, errorU }] = useUpdateMailMutation();

  useEffect(() => {
    if (isSuccessU) {
      setPrgsStatusCd("");
    }
  }, [isSuccessU]);

  /*   const fileHandler = (event) => {
    let fileObj = event.target.files[0];

    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        console.log(resp.cols);
        console.log(resp.rows);
        for (let i = 0; i < resp.rows.length; i++) {
          onSaveMailClicked(resp.rows[i]);
        }
      }
    });
  }; */

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  const onSaveMailClicked = async (data) => {
    await addNewMail({
      data,
    });
  };
  const [addNewMail, { isLoading: isILoading, isSuccess: isISuccess, isError: isIErorr, error: Ierror }] = useAddNewMailMutation();
  useEffect(() => {
    if (isISuccess) {
      console.log("here");
      navigate("/dash/mails");
    }
  }, [isISuccess, navigate]);

  const fileType = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      // console.log(selectedFile.type);
      let reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.readAsArrayBuffer(selectedFile);

      reader.onload = (e) => {
        //setExcelFileError(null);
        const bstr = e.target.result;
        if (bstr !== null) {
          console.log(bstr);
          const workbook = XLSX.read(bstr, { type: "buffer" });
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          //for (let i = 1; i < data.length; i++) {
          data.shift();
          const finalData = data.map((v) => ({ ...v, user: users[0].id }));
          console.log(finalData);
          onSaveMailClicked(finalData);
          //}
        } else {
          alert("error!");
        }
      };
    } else {
      console.log("plz select your file");
    }
  };
  const generatePDF = () => {

    var doc = new jsPDF("p", "pt");
    const json = require("../../img/arial-normal.json");
    doc.addFileToVFS("utps.ttf", json.id);
    doc.addFont("utps.ttf", "utps", "normal");
    doc.setFont("utps");
    doc.setFontSize(14);
    doc.text("UTPS Гаалийн хяналтын бүс", 60, 24);
    doc.text("Гарах хуудас", 120, 45);
    doc.text("UTPS Гаалийн хяналтын бүс", 350, 24);
    doc.text("Гарах хуудас", 410, 45);
    doc.setFontSize(12);
    doc.setFontSize(12);
    doc.text("Nº", 20, 33);
    doc.text("Nº", 310, 33);
    doc.text("1", 22, 75);
    doc.text("Илгээмжийн", 40, 65);
    doc.text("дугаар", 40, 80);
    
    doc.text("1", 312, 75);
    doc.text("Илгээмжийн", 330, 65);
    doc.text("дугаар", 330, 80);
    
    doc.text("2", 22, 115);
    doc.text("Бараа", 40, 105);
    doc.text("хүлээн авагч", 40, 120);
    doc.text("2", 312, 115);
    doc.text("Бараа", 330, 105);
    doc.text("хүлээн авагч", 330, 120);
    doc.text("3", 22, 150);
    doc.text("Барааны жин", 40, 150);
    
    doc.text("3", 312, 150);
    doc.text("Барааны жин", 330, 150);
    
    doc.text("4", 22, 180);
    doc.text("Барааны нэр", 40, 180);
    doc.text("4", 312, 180);
    doc.text("Барааны нэр", 330, 180);
    doc.text("5", 22, 213);
    doc.text("Манифестын", 40, 205);
    doc.text("дугаар", 40, 220);

    doc.text("5", 312, 213);
    doc.text("Манифестын", 330, 205);
    doc.text("дугаар", 330, 220);

    doc.text("6", 22, 248);
    doc.text("Гарсан огноо", 40, 248);
    doc.text("6", 312, 248);
    doc.text("Гарсан огноо", 330, 248);
    doc.text("7", 22, 285);
    doc.text("Зөвшөөрсөн ГУБ", 50, 285);
    doc.text("7", 312, 285);
    doc.text("Зөвшөөрсөн ГУБ", 340, 285);
    doc.text("8", 22, 345);
    doc.text("Тэмдэг", 75, 345);
    doc.text("8", 312, 345);
    doc.text("Тэмдэг", 365, 345);
    doc.text("Зөвшөөрсөн ГУАБ", 175, 285);
    doc.text("Тэмдэг", 205, 345);
    doc.text("Зөвшөөрсөн ГУАБ", 465, 285);
    doc.text("Тэмдэг", 495, 345);

    doc.rect(15, 10, 280, 370);
    doc.rect(305, 10, 280, 370);

    doc.line(35, 10, 35, 380);
    doc.line(35, 30, 295, 30);
    doc.line(15, 50, 295, 50);
    doc.line(15, 90, 295, 90);
    doc.line(15, 130, 295, 130);
    doc.line(15, 160, 295, 160);
    doc.line(15, 190, 295, 190);
    doc.line(15, 230, 295, 230);
    doc.line(15, 260, 295, 260);
    doc.line(15, 300, 295, 300);

    doc.line(120, 50, 120, 260);
    doc.line(160, 260, 160, 380);

    doc.line(325, 10, 325, 380);
    doc.line(325, 30, 585, 30);
    doc.line(305, 50, 585, 50);
    doc.line(305, 90, 585, 90);
    doc.line(305, 130, 585, 130);
    doc.line(305, 160, 585, 160);
    doc.line(305, 190, 585, 190);
    doc.line(305, 230, 585, 230);
    doc.line(305, 260, 585, 260);
    doc.line(305, 300, 585, 300);

    doc.line(410, 50, 410, 260);
    doc.line(450, 260, 450, 380);
    window.open(doc.output("bloburl"), "new", "height=800,width=700");
  };
  content = (
    <Box sx={{ height: 400, width: "100%" }}>
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 1 }}>
        <input type="file" onChange={handleFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"></input>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={onSendMailsClicked}
          size="small"
          sx={{
            bgcolor: "#6366F1",
            ":hover": { bgcolor: "#4338CA" },
          }}
        >
          Илгээх
        </Button>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={generatePDF}
          size="small"
          sx={{
            bgcolor: "#6366F1",
            ":hover": { bgcolor: "#4338CA" },
          }}
        >
          Хэвлэх
        </Button>
{/*         <Button
          variant="contained"
          startIcon={<CopyIcon />}
          onClick={onCopyMailsClicked}
          size="small"
          sx={{
            bgcolor: "#6366F1",
            ":hover": { bgcolor: "#4338CA" },
          }}
        >
          Хуулах
        </Button> */}
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={onDeleteMailsClicked}
          size="small"
          sx={{
            bgcolor: "#6366F1",
            ":hover": { bgcolor: "#4338CA" },
          }}
        >
          Устгах
        </Button>
        <Button
          variant="contained"
          endIcon={<MailIcon />}
          onClick={onNewMailClicked}
          size="small"
          sx={{
            bgcolor: "#6366F1",
            ":hover": { bgcolor: "#4338CA" },
          }}
        >
          Нэмэх
        </Button>
      </Stack>
      {isDelError ? <Alert severity="error">{delerror?.data?.message}</Alert> : <></>}
      <div style={{ height: 600 }}>
        <DataGrid
          sx={{ boxShadow: 2, bgcolor: '#fff' }}
          rows={rows}
          onRowSelectionModelChange={setSelection}
          {...rows}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 30]}
          checkboxSelection
          disableSelectionOnClick
          density="compact"
          localeText={gridDefaultLocaleText}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
    </Box>
  );
  return content;
};
export default MailsList;
