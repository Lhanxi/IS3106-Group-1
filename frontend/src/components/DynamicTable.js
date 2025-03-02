import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import DropdownCell from "./DropdownCell";
import AddColumn from "./AddColumn";
import axios from "axios";

const DynamicTable = ({ projectId }) => {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [newColumn, setNewColumn] = useState(""); 
  const [selectedTask, setSelectedTask] = useState(null); // Task selected for editing
  const [projectName, setProjectName] = useState("");
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false); //used to manage the add column pop up

  // Fetch tasks from the database
  useEffect(() => {
    axios.get(`http://localhost:5001/api/tasks/${projectId}/tasks`)
      .then((response) => {
        const formattedRows = response.data.map(({ _id, __v, ...rest }) => ({
          ...rest,
          id: _id, // Keep ID for selection, but hide it in the UI
        }));
        setRows(formattedRows);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [projectId]);
/*
  // Fetch columns from the database
  useEffect(() => {
    axios.get(`http://localhost:5001/api/tasks/${projectId}/cols`)
      .then((response) => {
        const columnNames = response.data.filter(col => col !== "_id" && col !== "__v" && col !== "projectId");

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
  */

  useEffect(() => {
    axios.get(`http://localhost:5001/api/tasks/${projectId}/cols`)
      .then((response) => {
        const columnNames = response.data.filter(col => col !== "_id" && col !== "__v" && col !== "projectId");
  
        axios.get(`http://localhost:5001/api/projects/${projectId}`)
          .then((projectResponse) => {
            const project = projectResponse.data;
            const dropdownColumns = project.defaultAttributes
              .filter(attr => attr.type === "dropdown")
              .map(attr => attr.name);
  
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
  
            //Edit button
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
          });
      })
      .catch((error) => console.error("Error fetching columns:", error));
  }, [projectId]);
  

  useEffect(() => {
    if (!projectId) {
      console.error("Project ID is undefined");
      return;
    }
  
    axios.get(`http://localhost:5001/api/projects/${projectId}/name`) // Corrected API route
      .then((response) => {
        console.log("Project name response:", response.data); // Debugging log
        if (response.data && response.data.name) {
          setProjectName(response.data.name);
        } else {
          console.error("Invalid response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching project name:", error));
  }, [projectId]);
  
  
  // Function to update task in backend
  const updateTask = async (updatedTask) => {
    setRows((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

    try {
      await axios.put(`http://localhost:5001/api/tasks/tasks/${updatedTask.id}`, updatedTask);
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

  const handleAddColumn = async (columnData) => {
    try {
      await axios.post(`http://localhost:5001/api/projects/${projectId}/add-attribute`, columnData);
  
      // Re-fetch updated columns
      const updatedProject = await axios.get(`http://localhost:5001/api/projects/${projectId}`);
      const updatedColumns = updatedProject.data.defaultAttributes.map((attr) => ({
        field: attr.name,
        headerName: attr.name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        width: 150,
        ...(attr.type === "dropdown" && { 
          renderCell: (params) => (
            <DropdownCell row={params.row} column={attr.name} projectId={projectId} updateTask={updateTask} />
          )
        }),
      }));
  
      setCols([...updatedColumns, {
        field: "actions",
        headerName: "Actions",
        width: 120,
        renderCell: (params) => (
          <Button size="small" variant="contained" onClick={() => handleEditClick(params.row)}>
            Edit
          </Button>
        ),
      }]);
  
      setIsAddColumnOpen(false); // Close popup
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };
  

  /*
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

      setRows(updatedTasks.data.map(({ _id, __v, ...rest }) => ({ ...rest, id: _id })));
      setCols(updatedColumns.data.filter(col => col !== "_id" && col !== "__v").map(col => ({
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
  
*/
  // Apply search filter by name
  const filteredRows = rows.filter((row) => row.name?.toLowerCase().includes(searchQuery.toLowerCase()));

return (
  <Box sx={{ width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
    {/* Project Name Header */}
    {projectName && (
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        {projectName}
      </Typography>
    )}

    {/* Centered Content */}
    <Box sx={{ width: "60%", maxWidth: 800, height: "auto", minHeight: 300 }}>
      {/* Search Bar */}
      <Box sx={{ display: "flex", marginBottom: "20px", gap: 2 }}>
        <TextField label="Search by Name" variant="outlined" fullWidth value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </Box>

      <Button variant="contained" onClick={() => setIsAddColumnOpen(true)}>
        Add Column
      </Button>


      {/* Dynamic Table */}
      <Box sx={{ width: "100%", height: 400 }}> {/* Fixed height to avoid ResizeObserver errors */}
        <DataGrid 
          rows={filteredRows} 
          columns={cols} 
          autoHeight={true} // Prevent dynamic height issues
          checkboxSelection 
          disableColumnMenu 
        />
      </Box>

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
    <AddColumn
      open={isAddColumnOpen} 
      onClose={() => setIsAddColumnOpen(false)} 
      onSubmit={handleAddColumn} 
    />

  </Box>
);

  
};
/*
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
*/
export default DynamicTable;
