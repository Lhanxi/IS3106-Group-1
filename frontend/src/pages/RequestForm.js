// import React, { useEffect, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { 
//     Box, Button, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Typography 
// } from "@mui/material";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const RequestForm = () => {
//     const { projectId } = useParams(); // ✅ Get projectId from URL

//     const { register, control, handleSubmit, reset } = useForm({ defaultValues: { projectId } });
//     const { fields, append, remove } = useFieldArray({ control, name: "dynamicFields" });
//     const [availableAttributes, setAvailableAttributes] = useState([]);

//     useEffect(() => {
//         if (projectId) {
//             axios.get(`http://localhost:5001/api/tasks/${projectId}/task-schema`)
//                 .then((res) => setAvailableAttributes(res.data))
//                 .catch((err) => console.error("Error fetching attributes:", err));
//         }
//     }, [projectId]);

//     const onSubmit = async (data) => {
//         const taskData = { projectId, ...data };
//         try {
//             await axios.post(`http://localhost:5001/api/tasks/${projectId}/tasks`, taskData);
//             reset();
//             alert("Task Created Successfully!");
//         } catch (error) {
//             console.error("Error creating task:", error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit(onSubmit)}>
//             <label>Task Name:</label>
//             <input {...register("name")} placeholder="Task Name" required />

//             <label>Status:</label>
//             <input {...register("status")} placeholder="Status" required />

//             <label>Description:</label>
//             <input {...register("description")} placeholder="Description" required />

//             <input {...register("projectId")} value={projectId} disabled />

//             <h4>Additional Attributes</h4>
//             {fields.map((field, index) => (
//                 <div key={field.id}>
//                     <select {...register(`dynamicFields.${index}.name`)}>
//                         <option value="">-- Select Attribute --</option>
//                         {availableAttributes.map(attr => <option key={attr} value={attr}>{attr}</option>)}
//                     </select>
//                     <input {...register(`dynamicFields.${index}.value`)} placeholder="Value" />
//                     <button type="button" onClick={() => remove(index)}>❌</button>
//                 </div>
//             ))}

//             <button type="button" onClick={() => append({ name: "", value: "" })}>➕ Add Attribute</button>
//             <button type="submit">Create Task</button>
//         </form>
//     );
// };

// export default RequestForm;


import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";
import { 
    Box, Button, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Typography 
} from "@mui/material";

const RequestForm = () => {
    const { projectId } = useParams();
    const { register, control, handleSubmit, reset } = useForm({ defaultValues: { projectId } });
    const { fields, append, remove } = useFieldArray({ control, name: "dynamicFields" });
    const [availableAttributes, setAvailableAttributes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (projectId) {
            axios.get(`http://localhost:5001/api/tasks/${projectId}/task-schema`)
                .then((res) => setAvailableAttributes(res.data))
                .catch((err) => console.error("Error fetching attributes:", err));
        }
    }, [projectId]);

    const onSubmit = async (data) => {
        const taskData = { projectId, ...data };
        try {
            await axios.post(`http://localhost:5001/api/tasks/${projectId}/tasks`, taskData);
            reset();
            setOpenDialog(true); // ✅ Open confirmation dialog
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <Box 
            display="flex" justifyContent="center" alignItems="center" height="100vh"
            sx={{ backgroundColor: "#f4f6f8" }}
        >
            <Box 
                sx={{
                    width: 450, bgcolor: "white", p: 4, borderRadius: 3, boxShadow: 3
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Create a Task Request
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* ✅ Name Field */}
                    <TextField
                        {...register("name", { required: true })}
                        label="Task Name" fullWidth required sx={{ mb: 2 }}
                    />

                    {/* ✅ Status Field */}
                    <TextField
                        {...register("status", { required: true })}
                        label="Status" fullWidth required sx={{ mb: 2 }}
                    />

                    {/* ✅ Description Field */}
                    <TextField
                        {...register("description", { required: true })}
                        label="Description" fullWidth required sx={{ mb: 2 }}
                    />

                    {/* ✅ Project ID (Disabled) */}
                    <TextField
                        {...register("projectId")}
                        label="Project ID" fullWidth disabled value={projectId} sx={{ mb: 2 }}
                    />

                    {/* ✅ Additional Attributes */}
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Additional Attributes</Typography>
                    {fields.map((field, index) => (
                        <Box key={field.id} display="flex" alignItems="center" sx={{ mb: 2 }}>
                            <Select
                                {...register(`dynamicFields.${index}.name`)}
                                displayEmpty fullWidth sx={{ mr: 2 }}
                            >
                                <MenuItem value="">-- Select Attribute --</MenuItem>
                                {availableAttributes.map(attr => (
                                    <MenuItem key={attr} value={attr}>{attr}</MenuItem>
                                ))}
                            </Select>
                            <TextField
                                {...register(`dynamicFields.${index}.value`)}
                                placeholder="Value" fullWidth sx={{ mr: 2 }}
                            />
                            <Button variant="contained" color="error" onClick={() => remove(index)}>❌</Button>
                        </Box>
                    ))}

                    {/* ✅ Add Attribute Button */}
                    <Button 
                        variant="contained" fullWidth sx={{ mt: 2, mb: 2 }} 
                        onClick={() => append({ name: "", value: "" })}
                    >
                        ➕ Add Attribute
                    </Button>

                    {/* ✅ Submit Button */}
                    <Button 
                        type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}
                    >
                        Create Task
                    </Button>
                </form>

                {/* ✅ Success Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Task Created</DialogTitle>
                    <DialogContent>
                        <Typography>Task has been successfully created!</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">OK</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default RequestForm;
