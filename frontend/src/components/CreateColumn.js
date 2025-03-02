import React, { useState, useEffect } from "react";
import "./CreateColumn.css"; 

const columnTypes = ["text", "number", "dropdown", "date", "people"];

const CreateColumn = ({ open, onClose }) => {
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

  const handleSubmit = () => {
    const newColumn = {
      name: columnName.trim(),
      type: columnType,
      options: columnType === "dropdown" ? dropdownOptions.filter(opt => opt.trim() !== "") : undefined
    };

    console.log("New Column:", newColumn);
    
    setColumnName("");
    setColumnType("text");
    setDropdownOptions([""]);
    
    onClose();
  };

  if (!open) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* Header */}
        <h2 className="popup-title">Add New Column</h2>

        {/* Column Name Input */}
        <input
          type="text"
          placeholder="Column Name"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          className="input-field"
        />

        {/* Column Type Dropdown */}
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

        {/* Dropdown Options (if "dropdown" is selected) */}
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
            <button onClick={handleAddOption} className="add-option-btn">
              + Add Option
            </button>
          </div>
        )}

        {/* Action Buttons (Side by Side) */}
        <div className="button-group">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleSubmit} className="add-btn">Add Column</button>
        </div>
      </div>
    </div>
  );
};

export default CreateColumn;
