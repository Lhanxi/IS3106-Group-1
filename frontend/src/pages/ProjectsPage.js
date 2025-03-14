import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, CircularProgress, Card, CardContent, Button } from "@mui/material";

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]); //gets and sets the list of projects for the current user
    const [loading, setLoading] = useState([]); //controls the loading status bar 

    useEffect(() => {
        //this will get the list of all the projects for the current user 
        const fetchProjects = async() => {
            try {
                const response = await axios.get(`https://localhost:5001/api/projects/${userId}/getProjects`); 
                setProjects(response.data);
            } catch {
                console.error("Error fetchign projects: ", error); 
            } finally {
                setLoading(false); //ends the loading bar
            }
        };

        fetchProjects();
    }, [userId]); 

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                My Projects
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                projects.length > 0 ? (
                    projects.map((project) => (
                        <Card key={project.id} style={{ marginBottom: "16px" }}>
                            <CardContent>
                                <Typography variant="h6">{project.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {project.description}
                                </Typography>
                                <Button variant="contained" color="primary" style={{ marginTop: "8px" }}>
                                    View Project
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography>No projects found.</Typography>
                )
            )}
        </Container>
    )
}

export default ProjectsPage;