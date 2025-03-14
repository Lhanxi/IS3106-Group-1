import React, { useState, useEffect } from "react";
import "./CreateColumn.css";
import axios from "axios";

const columnTypes = ["text", "number", "dropdown", "date", "people"];

const CreateColumn = ({ open, onClose, projectId }) => {
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("text");
  const [dropdownOptions, setDropdownOptions] = useState([""]);

  useEffect(() => {
    if (columnType !== "dropdown") {
      setDropdownOptions([""]);
    }
  }, [columnType]);

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

  const handleSubmit = async () => {
    if (!columnName.trim()) return; // Prevent submission if column name is empty
  
    const newColumn = {
      columnName: columnName.trim(),
      columnType: columnType,
      dropdownOptions: columnType === "dropdown" ? dropdownOptions.filter(opt => opt.trim() !== "") : []
    };
  
    try {
      // Send the new column to the backend via POST request
      console.log("Submitting column:", newColumn); // Debugging: Check the payload
  
      const response = await axios.post(`http://localhost:5001/api/projects/${projectId}/add-column`, newColumn);
  
      console.log("Column added successfully:", response.data); // Check backend response
  
      // Reset form state
      setColumnName("");
      setColumnType("text");
      setDropdownOptions([""]);
  
      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };
  

  if (!open) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2 className="popup-title">Add New Column</h2>
        <input
          type="text"
          placeholder="Column Name"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          className="input-field"
        />
        <label className="label">Column Type</label>
        <select
          value={columnType}
          onChange={(e) => setColumnType(e.target.value)}
          className="input-field"
        >
          {columnTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {columnType === "dropdown" && (
          <div className="dropdown-options">
            <label className="label">Dropdown Options</label>
            {dropdownOptions.map((option, index) => (
              <div key={index} className="option-row">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="input-field"
                />
                <button
                  onClick={() => handleRemoveOption(index)}
                  disabled={dropdownOptions.length === 1}
                  className="remove-option"
                >
                  ✕
                </button>
              </div>
            ))}
            <button onClick={handleAddOption} className="add-option-btn">+ Add Option</button>
          </div>
        )}
        <div className="button-group">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleSubmit} className="add-btn">Add Column</button>
        </div>
      </div>
    </div>
  );
};

export default CreateColumn;
