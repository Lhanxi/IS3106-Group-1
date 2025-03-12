import React, { useState } from "react";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DateSelectorCell = ({ value, handleUpdate }) => {
  const [selectedDate, setSelectedDate] = useState(value ? dayjs(value) : null);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (newDate) {
      handleUpdate(newDate.toISOString()); // Call handleUpdate with new date value
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} fullWidth size="small" />}
      />
    </LocalizationProvider>
  );
};

export default DateSelectorCell;
