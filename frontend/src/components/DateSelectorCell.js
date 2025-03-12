import React, { useState } from "react";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DateSelectorCell = ({ value }) => {
  const [selectedDate, setSelectedDate] = useState(value ? dayjs(value) : null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={selectedDate}
        onChange={(newDate) => setSelectedDate(newDate)}
        renderInput={(params) => <TextField {...params} fullWidth size="small" />}
      />
    </LocalizationProvider>
  );
};

export default DateSelectorCell;
