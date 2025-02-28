import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import axios from "axios";

const DynamicTable = ({ projectId }) => {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [newColumn, setNewColumn] = useState(""); 
  const [selectedTask, setSelectedTask] = useState(null); // Task selected for editing

  // Fetch tasks from the database
  useEffect(() => {
    axios.get(`http://localhost:5001/api/tasks/${projectId}/tasks`)
      .then((response) => {
        const formattedRows = response.data.map(row => ({
          ...row,
          id: row._id, 
        }));
        setRows(formattedRows);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [projectId]);

  // Fetch columns from the database
  useEffect(() => {
    axios.get(`http://localhost:5001/api/tasks/${projectId}/cols`)
      .then((response) => {
        const columnNames = response.data;

        const formattedColumns = columnNames.map((col) => ({
          field: col,
          headerName: col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
          width: 150,
          ...(col === "status" && { 
            renderCell: (params) => (
              <StatusDropdown row={params.row} projectId={projectId} updateTask={updateTask} />
            )
          }),
        }));

        // Add Action Button Column
        formattedColumns.push({
          field: "actions",
          headerName: "Actions",
          width: 120,
          renderCell: (params) => (
            <Button size="small" variant="contained" onClick={() => handleEditClick(params.row)}>
              Edit
            </Button>
          ),
        });

        setCols(formattedColumns);
      })
      .catch((error) => console.error("Error fetching columns:", error));
  }, [projectId]);

  // Function to update task in backend
  const updateTask = async (updatedTask) => {
    setRows((prevTasks) =>
      prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );

    try {
      await axios.put(`http://localhost:5001/api/tasks/tasks/${updatedTask._id}`, updatedTask);
    } catch (error) {
      console.error("Error updating task:", error.response?.status, error.response?.data);
    }
  };

  // Open edit modal
  const handleEditClick = (task) => {
    setSelectedTask(task);
  };

  // Handle input change in edit modal
  const handleFieldChange = (field, value) => {
    setSelectedTask((prev) => ({ ...prev, [field]: value }));
  };

  // Save edited task
  const handleSave = async () => {
    if (selectedTask) {
      await updateTask(selectedTask);
      setSelectedTask(null); // Close modal after saving
    }
  };

  // Add a new column
  const handleAddColumn = async () => {
    if (!newColumn.trim()) return; 
  
    try {
      await axios.post(`http://localhost:5001/api/tasks/${projectId}/add-attribute`, {
        attributeName: newColumn,
        defaultValue: "" 
      });

      // Re-fetch updated data
      const [updatedTasks, updatedColumns] = await Promise.all([
        axios.get(`http://localhost:5001/api/tasks/${projectId}/tasks`),
        axios.get(`http://localhost:5001/api/tasks/${projectId}/cols`)
      ]);

      setRows(updatedTasks.data.map(row => ({ ...row, id: row._id })));
      setCols(updatedColumns.data.map(col => ({
        field: col,
        headerName: col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        width: 150,
        ...(col === "status" && { 
          renderCell: (params) => (
            <StatusDropdown row={params.row} projectId={projectId} updateTask={updateTask} />
          )
        }),
      })));

      setNewColumn(""); 
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };
  
  // Apply search filter by name
  const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", height: "100vh", width: "100vw" }}>
      <Box sx={{ width: "60%", maxWidth: 800, height: "auto", minHeight: 300 }}>
        {/* Search Bar */}
        <Box sx={{ display: "flex", marginBottom: "20px", gap: 2 }}>
          <TextField label="Search by Name" variant="outlined" fullWidth value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </Box>

        {/* Add Column Section */}
        <Box sx={{ display: "flex", marginBottom: "20px", gap: 2 }}>
          <TextField label="New Column Name" variant="outlined" fullWidth value={newColumn} onChange={(e) => setNewColumn(e.target.value)} />
          <Button variant="contained" onClick={handleAddColumn}>Add Column</Button>
        </Box>

        {/* Dynamic Table */}
        <DataGrid rows={filteredRows} columns={cols} autoHeight checkboxSelection disableColumnMenu />

        {/* Edit Task Modal */}
        {selectedTask && (
          <Dialog open={true} onClose={() => setSelectedTask(null)} fullWidth>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 2 }}>
              {Object.keys(selectedTask).map((field) => 
                field !== "id" && field !== "_id" && field !== "__v" && (
                  field === "status" ? (
                    <Select key={field} value={selectedTask[field]} onChange={(e) => handleFieldChange(field, e.target.value)} fullWidth>
                      <MenuItem value="To Do">To Do</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Done">Done</MenuItem>
                    </Select>
                  ) : (
                    <TextField key={field} label={field} variant="outlined" fullWidth value={selectedTask[field]} onChange={(e) => handleFieldChange(field, e.target.value)} />
                  )
                )
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedTask(null)}>Cancel</Button>
              <Button variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
};

// Dropdown component for status
const StatusDropdown = ({ row, projectId, updateTask }) => {
  const [status, setStatus] = useState(row.status);
  const handleChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    const updatedTask = { ...row, status: newStatus };
    await updateTask(updatedTask);
  };

  return <Select value={status} onChange={handleChange} fullWidth size="small" variant="outlined">
    <MenuItem value="To Do">To Do</MenuItem>
    <MenuItem value="In Progress">In Progress</MenuItem>
    <MenuItem value="Done">Done</MenuItem>
  </Select>;
};

export default DynamicTable;
