import React, { useEffect, useState } from "react";
import { Select, MenuItem } from "@mui/material";
import axios from "axios";

const DropdownCell = ({ row, column, projectId, updateTask }) => {
  const [value, setValue] = useState(row.attributes[column]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5001/api/projects/${projectId}`)
      .then((response) => {
        const project = response.data;
        const attribute = project.defaultAttributes.find(attr => attr.name === column && attr.type === "dropdown");
        if (attribute) {
          setOptions(attribute.options);
        }
      })
      .catch(error => console.error(`Error fetching options for ${column}:`, error));
  }, [projectId, column]);

  const handleChange = async (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    const updatedTask = { ...row, attributes: { ...row.attributes, [column]: newValue } };
    await updateTask(updatedTask);
  };

  return (
    <Select value={value} onChange={handleChange} fullWidth size="small" variant="outlined">
      {options.map(option => (
        <MenuItem key={option} value={option}>{option}</MenuItem>
      ))}
    </Select>
  );
};

export default DropdownCell;
