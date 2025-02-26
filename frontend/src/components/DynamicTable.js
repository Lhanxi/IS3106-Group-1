import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Select, MenuItem, FormControl, InputLabel, TextField } from "@mui/material";
import axios from "axios";




const DynamicTable = ({projectId}) => {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Track selected filter value
  const [searchQuery, setSearchQuery] = useState(""); // Track search query

  useEffect(() => {
    axios.get(`http://localhost:5001/api/tasks/${projectId}/tasks`)
      .then((response) => {
        const formattedRows = response.data.map(row => ({
          ...row,
          id: row._id //neceesary because of how MUI workds
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
          headerName: col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()), // Format headers
          width: 150, // Adjust width as needed
        }));
  
        setCols(formattedColumns);
      })
      .catch((error) => {
        console.error("Error fetching columns:", error);
      });
  }, [projectId]);
  

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
        {/* Filters (Search and Status Dropdown) side by side */}
        <Box sx={{ display: "flex", marginBottom: "20px", gap: 2 }}>
          {/* Search Input */}
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Search by Name"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>

        </Box>

        <DataGrid
          rows={filteredRows} // Use the filtered rows
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
