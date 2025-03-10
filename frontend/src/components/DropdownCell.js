import React, { useEffect, useState } from "react";
import { Select, MenuItem } from "@mui/material";
import axios from "axios";

const DropdownCell = ({ row, column, projectId, updateTask }) => {
  const [value, setValue] = useState(row?.[column] || "");  // does not need to access attributes because it has already flattened the columns
  const [options, setOptions] = useState([]);

  // Log the row object to see its structure
  useEffect(() => {
    console.log("Row data:", row);
  }, [row]);  // Log whenever the row changes

  // Fetch options for the dropdown
  useEffect(() => {
    console.log("Fetching dropdown options for projectId:", projectId, "and column:", column);

    axios.get(`http://localhost:5001/api/projects/${projectId}`)
      .then((response) => {
        const project = response.data;
        const attribute = project.defaultAttributes.find(attr => attr.name === column && attr.type === "dropdown");

        if (attribute) {
          setOptions(attribute.options);  // Set dropdown options if available
        } else {
          setOptions([]);  // Empty options if none are found
        }
      })
      .catch(error => console.error(`Error fetching options for ${column}:`, error));
  }, [projectId, column]);  // Re-fetch if projectId or column changes

  // Handle value change in dropdown
  const handleChange = async (event) => {
    const newValue = event.target.value;
    setValue(newValue);  // Set the selected value in state

    // Create an updated task object with the new value
    const updatedTask = { 
      ...row, 
      attributes: { 
        ...row.attributes, 
        [column]: newValue  // Update the specific column in the task's attributes
      } 
    };

    console.log("Updated Task:", updatedTask);  // Log the updated task for debugging

    // Update the task in the DynamicTable
    await updateTask(updatedTask);
  };

  // Log the current value of the dropdown for debugging
  useEffect(() => {
    console.log("Current value of the dropdown: ", value);
  }, [value]);

  return (
    <Select 
      value={value}  // Ensure that the value is correctly set
      onChange={handleChange}  // Handle value change
      fullWidth 
      size="small" 
      variant="outlined"
    >
      {options.length > 0 ? (
        options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="" disabled>No options available</MenuItem>  // Message when no options are available
      )}
    </Select>
  );
};

export default DropdownCell;
