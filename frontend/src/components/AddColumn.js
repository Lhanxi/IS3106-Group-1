const AddColumn = ({ open, onClose, projectId, onUpdateTable }) => {
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("text");
  const [dropdownOptions, setDropdownOptions] = useState([""]);

  useEffect(() => {
    if (columnType !== "dropdown") {
      setDropdownOptions([""]);
    }
  }, [columnType]);

  const handleAddOption = () => {
    setDropdownOptions((prevOptions) => [...prevOptions, ""]);
  };

  const handleRemoveOption = (index) => {
    setDropdownOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    setDropdownOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const handleSubmit = async () => {
    const newColumn = {
      name: columnName.trim(),
      type: columnType,
      dropdownOptions: columnType === "dropdown" ? dropdownOptions.filter(opt => opt.trim() !== "") : []
    };

    try {
      // Send POST request to add the new column
      await axios.post(`/api/projects/${projectId}/add-column`, newColumn);

      // Fetch updated project and tasks after adding the new column
      const updatedProject = await axios.get(`/api/projects/${projectId}`);
      const updatedTasks = await axios.get(`/api/tasks/${projectId}/tasks`);

      // Update the DynamicTable with the new columns and data
      onUpdateTable(updatedProject.data, updatedTasks.data);

      // Close the dialog and reset form
      setColumnName("");
      setColumnType("text");
      setDropdownOptions([""]);
      onClose();
    } catch (error) {
      console.error("Error adding column:", error);
      alert("Failed to add column");
    }
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

        <FormControl fullWidth margin="dense">
          <InputLabel>Column Type</InputLabel>
          <Select
            value={columnType}
            onChange={(e) => setColumnType(e.target.value)}
            label="Column Type"
          >
            {columnTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {columnType === "dropdown" && (
          <>
            {dropdownOptions.map((option, index) => (
              <div key={`dropdown-option-${index}`} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <IconButton 
                  onClick={() => handleRemoveOption(index)} 
                  disabled={dropdownOptions.length === 1}
                >
                  <Remove />
                </IconButton>
              </div>
            ))}
            <Button startIcon={<Add />} onClick={handleAddOption}>
              Add Option
            </Button>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Add Column
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddColumn;
