import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";

const DynamicTable = ({ projectId }) => {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [newColumn, setNewColumn] = useState(""); // Track new column input

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

  useEffect(() => {
    axios.get(`http://localhost:5001/api/tasks/${projectId}/cols`)
      .then((response) => {
        const columnNames = response.data;

        const formattedColumns = columnNames.map((col) => ({
          field: col,
          headerName: col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
          width: 150, 
        }));

        setCols(formattedColumns);
      })
      .catch((error) => {
        console.error("Error fetching columns:", error);
      });
  }, [projectId]);

  const handleAddColumn = async () => {
    if (!newColumn.trim()) return; // Ignore empty input
  
    try {
      // Send request to backend to add the new attribute to all tasks in the project
      await axios.post(`http://localhost:5001/api/tasks/${projectId}/add-attribute`, {
        attributeName: newColumn,
        defaultValue: "" // Default value for the new column
      });
  
      // Fetch updated tasks after adding new attribute
      const updatedResponse = await axios.get(`http://localhost:5001/api/tasks/${projectId}/tasks`);
      const updatedRows = updatedResponse.data.map(row => ({
        ...row,
        id: row._id,
      }));
  
      setRows(updatedRows);
  
      // Add new column to UI
      const newCol = {
        field: newColumn,
        headerName: newColumn.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        width: 150,
      };
  
      setCols([...cols, newCol]); 
      setNewColumn(""); 
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };
  
  

  const filteredRows = rows.filter((row) => {
    const statusMatch = statusFilter === "" || row.status === statusFilter;
    const searchMatch =
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      row.status.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

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

export default DynamicTable;
