import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KanbanCard from '../components/KanbanCard';
import "./Kanban.css";

const Kanban = ({ projectId }) => {
    // State for statuses and tasks
    const [statuses, setStatuses] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Fetch statuses from the backend
        const getStatuses = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/tasks/${projectId}/statuses`);
                setStatuses(response.data || []);
            } catch (error) {
                console.error("Error fetching statuses:", error.response?.status, error.response?.data);
            }
        };

        if (projectId) getStatuses();
    }, [projectId]);

    useEffect(() => {
        // Fetch tasks from the backend
        const getTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/tasks/${projectId}/tasks`);
                setTasks(response.data || []);
            } catch (error) {
                console.error("Error fetching tasks:", error.response?.status, error.response?.data);
            }
        };

        if (projectId) getTasks();
    }, [projectId]);

    const updateTask = async (updatedTask) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === updatedTask._id ? { ...task, status: updatedTask.status } : task
            )
        );
    
        try {
            await axios.put(`http://localhost:5001/api/tasks/${updatedTask._id}`, updatedTask);
        } catch (error) {
            console.error("Error updating task:", error.response?.status, error.response?.data);
            // Optional: Revert state update in case of an error
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === updatedTask._id ? { ...task, status: task.status } : task
                )
            );
        }
    };
    
    const handleDrop = (e, status) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("id");
        const task = tasks.find((task) => task._id === id);
    
        if (task && task.status !== status) {
            updateTask({ ...task, status });
        }
    };
    

    return (
        <div className="kanban-board">
            {statuses.length > 0 ? (
                statuses.map((status) => (
                    <div 
                        key={status} 
                        onDrop={(e) => handleDrop(e, status)}
                        onDragOver={(e) => e.preventDefault()}
                        className="kanban-column"
                    >
                        <h3>{status}</h3>
                        <div className="kanban-tasks">
                            {tasks
                                .filter((task) => task.status === status)
                                .map((task) => (
                                    <KanbanCard key={task._id} task={task} />
                                ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading statuses...</p>
            )}
        </div>
    );
};

export default Kanban;
