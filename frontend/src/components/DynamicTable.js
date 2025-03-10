import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import DropdownCell from "./DropdownCell";
import AddColumnButton from "./AddColumnButton";
import axios from "axios";

const DynamicTable = ({ projectId }) => {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [newColumn, setNewColumn] = useState(""); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  useEffect(() => {
    if (!projectId) {
      console.error("Project ID is undefined");
      return;
    }

    // Fetch columns, project details, and tasks
    axios.get(`http://localhost:5001/api/projects/${projectId}/cols`)
      .then((columnResponse) => {
        const columnNames = columnResponse.data.filter(col => col !== "_id" && col !== "__v" && col !== "projectId");

        axios.get(`http://localhost:5001/api/projects/${projectId}`)
          .then((projectResponse) => {
            const project = projectResponse.data;
            const dropdownColumns = project.defaultAttributes
              .filter(attr => attr.type === "dropdown")
              .map(attr => attr.name);

            axios.get(`http://localhost:5001/api/tasks/${projectId}/tasks`)
              .then((taskResponse) => {
                const formattedRows = taskResponse.data.map(({ _id, attributes, ...rest }) => {
                  const rowData = { ...rest, id: _id };
                  if (attributes) {
                    Object.keys(attributes).forEach((key) => {
                      rowData[key] = attributes[key];
                    });
                  }
                  return rowData;
                });

                setRows(formattedRows);

                // Format columns dynamically
                const formattedColumns = columnNames.map((col) => ({
                  field: col,
                  headerName: col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
                  width: 150,
                  ...(dropdownColumns.includes(col) && {
                    renderCell: (params) => (
                      <DropdownCell row={params.row} column={col} projectId={projectId} updateTask={updateTask} />
                    )
                  }),
                }));

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
              .catch((error) => console.error("Error fetching tasks:", error));
          })
          .catch((error) => console.error("Error fetching project details:", error));
      })
      .catch((error) => console.error("Error fetching project columns:", error));
  }, [projectId]);

  useEffect(() => {
    axios.get(`http://localhost:5001/api/projects/${projectId}/name`)
      .then((response) => {
        if (response.data?.name) {
          setProjectName(response.data.name);
        } else {
          console.error("Invalid response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching project name:", error));
  }, [projectId]);

  // Function to update a task
  const updateTask = async (updatedTask) => {
    setRows((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))  // Update the task in state
    );
  
    try {
      await axios.put(`http://localhost:5001/api/tasks/tasks/${updatedTask.id}`, updatedTask);  // Save updated task to the server
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
      setSelectedTask(null);
    }
  };

  // Handle adding new column
  const handleAddColumn = async () => {
    if (!newColumn.trim()) return; 

    try {
      await axios.post(`http://localhost:5001/api/projects/${projectId}/add-attribute`, {
        attributeName: newColumn,
        defaultValue: ""
      });

      setCols((prevCols) => [
        ...prevCols,
        {
          field: newColumn,
          headerName: newColumn.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
          width: 150,
        },
      ]);

      setNewColumn(""); 
      setIsAddColumnOpen(false);
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  // Apply search filter by name
  const filteredRows = rows.filter((row) => row.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box sx={{ width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
      {projectName && (
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          {projectName}
        </Typography>
      )}

      <Box sx={{ width: "60%", maxWidth: 800, height: "auto", minHeight: 300 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: "20px" }}>
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box sx={{ flexGrow: 1, height: 400 }}>
            <DataGrid 
              rows={filteredRows} 
              columns={cols} 
              autoHeight 
              checkboxSelection 
              disableColumnMenu 
            />
          </Box>

          <Box>
            <AddColumnButton onClick={() => setIsAddColumnOpen(true)} />
          </Box>
        </Box>

        {isAddColumnOpen && (
          <Box sx={{ display: "flex", gap: 2, marginTop: "10px" }}>
            <TextField
              label="New Column Name"
              variant="outlined"
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddColumn}>
              Add
            </Button>
          </Box>
        )}

        {selectedTask && (
          <Dialog open={true} onClose={() => setSelectedTask(null)} fullWidth>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 2 }}>
              {Object.keys(selectedTask).map((field) => 
                field !== "id" && field !== "_id" && field !== "__v" && (
                  <TextField key={field} label={field} variant="outlined" fullWidth value={selectedTask[field]} onChange={(e) => handleFieldChange(field, e.target.value)} />
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

export default DynamicTable;
