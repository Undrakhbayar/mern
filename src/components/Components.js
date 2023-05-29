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

const CustomInput = ({ style, label, value, inputProps, onChange, InputProps, error, helperText, register }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      sx={{ mx: 2, mb: 1 }}
      style={style}
      label={label}
      value={value}
      inputProps={inputProps}
      onChange={onChange}
      InputProps={InputProps}
      error={error}
      helperText={helperText}
      {...register}
    />
  );
};
const DisabledInput = styled(TextField)({
  "& .MuiInputBase-root.Mui-disabled": {
    backgroundColor: "#f0f0f0",
  },
});
const CustomFormLabel = ({ name, required }) => {
  return (
    <FormLabel required={required} sx={{ fontWeight: "600", fontSize: "14px", color: "text.primary", ml: 2, py: 0.5 }}>
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
export { GreenRedSwitch, CustomInput, OrderStatus, CustomFormLabel, theme, DisabledInput, style };
