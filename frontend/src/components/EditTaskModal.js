import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from "@mui/material";
import DropdownCell from "./DropdownCell";  // Import DropdownCell

const EditTaskModal = ({ open, onClose, task, onSave, onFieldChange, dropdownColumns }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 2 }}>
        {Object.keys(task).map((field) =>
          field !== "id" && field !== "_id" && field !== "__v" && (
            dropdownColumns.includes(field) ? (
              <div key={field}>
                {/* Add Title for Dropdown Column */}
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  {field} {/* This will display the name of the dropdown column */}
                </Typography>
                <DropdownCell
                  row={task}
                  column={field}
                  projectId={task.projectId}
                  updateTask={onSave}
                />
              </div>
            ) : (
              <TextField
                key={field}
                label={field}
                variant="outlined"
                fullWidth
                value={task[field]}
                onChange={(e) => onFieldChange(field, e.target.value)}
              />
            )
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(task)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;
