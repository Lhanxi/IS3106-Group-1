import React, { useEffect, useState } from "react";
import { Select, MenuItem } from "@mui/material";

const DropdownCell = ({ value, options }) => {
  return (
  <Select value={value || ""} fullWidth size="small" variant="outlined">
    {options?.length ? (
      options.map((option, index) => (
        <MenuItem key={index} value={option}>
          {option}
        </MenuItem>
      ))
    ) : (
      <MenuItem value="" disabled>No options available</MenuItem>
    )}
  </Select>
  );
};

export default DropdownCell;