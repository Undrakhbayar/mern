import React from "react";
import { alpha, styled } from "@mui/material/styles";
import { red, green } from "@mui/material/colors";
import { Switch, TextField, Chip, FormLabel, createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: { color: "red" },
      },
    },
  },
});

const GreenRedSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    color: red[600],
  },
  "& .MuiSwitch-track": {
    backgroundColor: red[600],
  },
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: green[600],
    "&:hover": {
      backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: green[600],
  },
}));

const CustomInput = ({ style, label, value, inputProps, onChange }) => {
  return (
    <TextField variant="outlined" size="small" sx={{ mr:2 }} style={style} label={label} value={value} inputProps={inputProps} onChange={onChange} />
  );
};

const CustomFormLabel = ({ name }) => {
  return (
    <FormLabel required sx={{ fontWeight: "600", fontSize: "14px", color: "text.primary", ml:0.5, pb:0.5, pt:0.5 }}>
      {name}
    </FormLabel>
  );
};
const OrderStatus = ({ status }) => {
  let color, text;

  switch (status) {
    case "10":
      color = "warning";
      text = "Хадгалсан";
      break;
    case "11":
      color = "success";
      text = "Илгээсэн";
      break;
    case "On The Way":
      color = "info";
      break;
    case "Cancelled":
      color = "error";
      break;
    default:
      color = "success";
  }

  return <Chip variant="outlined" size="small" color={color} label={text} />;
};
export { GreenRedSwitch, CustomInput, OrderStatus, CustomFormLabel, theme };
