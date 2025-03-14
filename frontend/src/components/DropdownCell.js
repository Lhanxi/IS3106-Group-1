import React from "react";
import { Select, MenuItem } from "@mui/material";

const DropdownCell = ({ value, options, handleUpdate }) => {
  return (
    <Select
      value={value || ""}
      fullWidth
      size="small"
      variant="outlined"
      onChange={(event) => handleUpdate(event.target.value)} // Calls handleUpdate
    >
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
