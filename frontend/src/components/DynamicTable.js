import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, TextField, Select, MenuItem } from "@mui/material";
import axios from "axios";

const DynamicTable = ({ projectId }) => {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [newColumn, setNewColumn] = useState(""); 

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
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
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

        setCols(formattedColumns);
      })
      .catch((error) => {
        console.error("Error fetching columns:", error);
      });
  }, [projectId]);

  // Function to update task status in backend
  const updateTask = async (updatedTask) => {
    setRows((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? { ...task, status: updatedTask.status } : task
      )
    );

    try {
      await axios.put(`http://localhost:5001/api/tasks/tasks/${updatedTask._id}`, {
        status: updatedTask.status, // Send only the updated field
      });
    } catch (error) {
      console.error("Error updating task:", error.response?.status, error.response?.data);
      // Revert UI update if the request fails
      setRows((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? { ...task, status: task.status } : task
        )
      );
    }
  };

  // Add a new column to the database
  const handleAddColumn = async () => {
    if (!newColumn.trim()) return; 
  
    try {
      await axios.post(`http://localhost:5001/api/tasks/${projectId}/add-attribute`, {
        attributeName: newColumn,
        defaultValue: "" 
      });

      // Re-fetch updated data from the backend
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box sx={{ width: "60%", maxWidth: 800, height: "auto", minHeight: 300 }}>
        {/* Search Bar */}
        <Box sx={{ display: "flex", marginBottom: "20px", gap: 2 }}>
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        {/* Add Column Section */}
        <Box sx={{ display: "flex", marginBottom: "20px", gap: 2 }}>
          <TextField
            label="New Column Name"
            variant="outlined"
            fullWidth
            value={newColumn}
            onChange={(e) => setNewColumn(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddColumn}>Add Column</Button>
        </Box>

        {/* Dynamic Table */}
        <DataGrid
          rows={filteredRows}
          columns={cols}
          autoHeight
          checkboxSelection
          disableColumnMenu
        />
      </Box>
    </Box>
  );
};

// Dropdown component for status
const StatusDropdown = ({ row, projectId, updateTask }) => {
  const [status, setStatus] = useState(row.status);

  const handleChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus); // Optimistically update UI

    const updatedTask = { ...row, status: newStatus };

    try {
      await updateTask(updatedTask);
    } catch (error) {
      console.error("Error updating status:", error);
      setStatus(row.status); // Revert UI if API call fails
    }
  };

  return (
    <Select
      value={status}
      onChange={handleChange}
      fullWidth
      size="small"
      variant="outlined"
    >
      <MenuItem value="To Do">To Do</MenuItem>
      <MenuItem value="In Progress">In Progress</MenuItem>
      <MenuItem value="Done">Done</MenuItem>
    </Select>
  );
};

export default DynamicTable;
