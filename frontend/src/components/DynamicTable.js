import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DropdownCell from "./DropdownCell";
import DateSelectorCell from "./DateSelectorCell";
import dayjs from "dayjs";

const DynamicTable = ({ projectId }) => {
  const [cols, setCols] = useState([]); // updates the cols and starts with an empty array 
  const [tasks, setTasks] = useState([]); // updates the rows for each of the tasks
  const [peopleMap, setPeopleMap] = useState({}); //hashmap for ID -> Name

  const handleUpdate = async (taskId, field, newValue) => {
    try {
      // 1. Construct the API request payload
      const payload = { field, newValue };
  
      // 2. Send a PATCH request with taskId included in the URL
      const response = await axios.patch(`/api/projects/${projectId}/update-task/${taskId}`, payload);
  
      if (response.status !== 200) {  // Fixing incorrect status check
        throw new Error(`Failed to update ${field}: ${response.statusText}`);
      }
  
      // 3. Update only the relevant task in `tasks`
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, [field]: newValue } : task
        )
      );
  
      console.log(`Updated ${field} for task ${taskId} to:`, newValue);
    } catch (error) {
      console.error(`Error updating ${field}:`, error.response ? error.response.data : error.message);
    }
  };
  

  useEffect(() => {
    const getColsAndTasks = async () => {
      //updates the columnns and tasks for the table
      try {
        console.log("Fetching project data for projectId:", projectId);

        const response = await axios.get(`api/projects/${projectId}`); 
        console.log("API Response:", response.data);

        const project = response.data; 

        // Fetch people list separately
        const peopleResponse = await axios.get(`api/projects/${projectId}/people`); 
        const peopleMap = peopleResponse.data; 

        setPeopleMap(peopleMap); // Store in state
        console.log("People Hash Map:", peopleMap);

        const tableColumns = project.attributes.map((attr, index) => {
          const fieldName = attr.name.replace(/\s+/g, "").charAt(0).toLowerCase() + attr.name.slice(1); // Ensure lowercase first letter
        
          return {
            field: fieldName,
            headerName: attr.name,
            width: 200,
            renderCell: (params) => {
              if (attr.type === "dropdown") {
                return (
                  <DropdownCell
                    value={params.value}
                    options={attr.options}
                    handleUpdate={(newValue) => handleUpdate(params.row.id, attr.name.toLowerCase(), newValue)}
                  />
                );
              }

              if (attr.type === "date") {
                return (  
                  <DateSelectorCell
                    value={params.value}
                    handleUpdate={(newValue) => handleUpdate(params.row.id, attr.name.toLowerCase(), newValue)}
                  />
                )
              }

              if (attr.type === "people") {
                return (
                  <DropdownCell
                    value={params.value}
                    options={project.people.map(personId => (
                      peopleMap[personId]))}
                    handleUpdate={(newValue) => handleUpdate(params.row.id, attr.name.toLowerCase(), newValue)}
                  />
                );
              }
              


              return <span>{params.value}</span>;
            },
            key: `column-${index}` // Ensure unique column keys
          };
        });
        
        console.log("Generated Columns:", tableColumns);

        const formattedTasks = project.tasks.map((task) => ({
          id: task._id,
          name: task.name,
          status: task.status,
          priority: task.priority,
          deadline: task.deadline ? dayjs(task.deadline) : null,
          assignedTo: task.assignedTo.map(personId => peopleMap[personId] || "Unknown").join(", "),
        }));

        console.log("Formatted Tasks:", formattedTasks);

        setCols(tableColumns);
        console.log("Updated Columns State:", tableColumns);

        setTasks(formattedTasks);
        console.log("Updated Tasks State:", formattedTasks);
      } catch (error) {
        console.error("Error fetching columns and tasks: ", error);
      }
    };

    if (projectId) {
      getColsAndTasks();
    }
  }, [projectId]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
          rows={tasks}
          columns={cols}
          getRowId={(task) => task.id}
          pageSize={5}
          disableSelectionOnClick
      />
    </div>
  );
};

export default DynamicTable;
