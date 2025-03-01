import React, { useState } from "react";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css"; 
import { Button, Select, MenuItem } from "@mui/material";

const initialColumns = [
  { key: "id", name: "ID", editable: false },
  { key: "name", name: "Name", editable: true },
  { key: "age", name: "Age", editable: true },
  { key: "role", name: "Role", editable: true, editor: RoleEditor },
];

const initialRows = [
  { id: 1, name: "Alice", age: 28, role: "Developer" },
  { id: 2, name: "Bob", age: 35, role: "Designer" },
];

function RoleEditor({ row, onRowChange }) {
  return (
    <Select
      value={row.role}
      onChange={(e) => onRowChange({ ...row, role: e.target.value })}
      fullWidth
    >
      <MenuItem value="Developer">Developer</MenuItem>
      <MenuItem value="Designer">Designer</MenuItem>
      <MenuItem value="Manager">Manager</MenuItem>
    </Select>
  );
}

function CustomDataGrid() {
  const [columns, setColumns] = useState(initialColumns);
  const [rows, setRows] = useState(initialRows);

  // Add new column dynamically
  const addColumn = () => {
    const newKey = `col${columns.length}`;
    setColumns([...columns, { key: newKey, name: `Column ${columns.length}`, editable: true }]);
    setRows(rows.map((row) => ({ ...row, [newKey]: "" })));
  };

  // Handle cell edits
  const onRowsChange = (newRows) => setRows(newRows);

  return (
    <div style={{ padding: 20 }}>
      <Button onClick={addColumn} variant="contained" style={{ marginBottom: 10 }}>
        Add Column
      </Button>
      <DataGrid columns={columns} rows={rows} onRowsChange={onRowsChange} />
    </div>
  );
}

export default CustomDataGrid;
