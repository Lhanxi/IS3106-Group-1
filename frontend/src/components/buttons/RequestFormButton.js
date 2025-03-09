import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const RequestFormButton = ({ projectId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (!projectId) {
            alert("Project ID is required!");
            return;
        }
        navigate(`/form/${projectId}`);
    };

    return (
        <Button 
            variant="contained" 
            color="primary" 
            onClick={handleClick}
            sx={{ mt: 2 }}
        >
            Add Request
        </Button>
    );
};

export default RequestFormButton;
