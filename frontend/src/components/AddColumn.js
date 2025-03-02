import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const columnTypes = ["text", "number", "dropdown", "date", "people"];

const AddColumn = ({ open, onClose, onSubmit }) => {
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("text");
  const [dropdownOptions, setDropdownOptions] = useState([""]);

  const handleAddOption = () => {
    setDropdownOptions([...dropdownOptions, ""]);
  };

  const handleRemoveOption = (index) => {
    setDropdownOptions(dropdownOptions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...dropdownOptions];
    newOptions[index] = value;
    setDropdownOptions(newOptions);
  };

  const handleSubmit = () => {
    const newColumn = {
      name: columnName,
      type: columnType,
      options: columnType === "dropdown" ? dropdownOptions.filter(opt => opt.trim() !== "") : undefined
    };
    onSubmit(newColumn);
    setColumnName("");
    setColumnType("text");
    setDropdownOptions([""]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Column</DialogTitle>
      <DialogContent>
        <TextField 
          fullWidth 
          label="Column Name" 
          value={columnName} 
          onChange={(e) => setColumnName(e.target.value)} 
          margin="dense"
        />

        <TextField 
          fullWidth 
          select 
          label="Column Type" 
          value={columnType} 
          onChange={(e) => setColumnType(e.target.value)} 
          margin="dense"
        >
          {columnTypes.map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>

        {columnType === "dropdown" && (
          <>
            {dropdownOptions.map((option, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <TextField 
                  fullWidth 
                  label={`Option ${index + 1}`} 
                  value={option} 
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <IconButton onClick={() => handleRemoveOption(index)} disabled={dropdownOptions.length === 1}>
                  <Remove />
                </IconButton>
              </div>
            ))}
            <Button startIcon={<Add />} onClick={handleAddOption}>Add Option</Button>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Add Column</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddColumn;
