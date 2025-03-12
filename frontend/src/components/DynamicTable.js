import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DropdownCell from "./DropdownCell";

const DynamicTable = ({ projectId }) => {
  const [cols, setCols] = useState([]); // updates the cols and starts with an empty array 
  const [tasks, setTasks] = useState([]); // updates the rows for each of the tasks

  useEffect(() => {
    const getColsAndTasks = async () => {
      try {
        console.log("Fetching project data for projectId:", projectId);

        const response = await axios.get(`api/projects/${projectId}`); 
        console.log("API Response:", response.data);

        const project = response.data; 

        const tableColumns = project.attributes.map((attr, index) => {
          const fieldName = attr.name.replace(/\s+/g, "").charAt(0).toLowerCase() + attr.name.slice(1); // Ensure lowercase first letter
        
          return {
            field: fieldName,
            headerName: attr.name,
            width: 150,
            renderCell: (params) => {
              console.log(`Rendering cell for field: ${attr.name}, Value:`, params.value);
        
              if (attr.type === "dropdown") {
                return <DropdownCell value={params.value} options={attr.options} />; 
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
          deadline: new Date(task.deadline).toLocaleDateString(),
          assignedTo: task.assignedTo.join(", "), // Convert assigned users to a string
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
