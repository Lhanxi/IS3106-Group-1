import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KanbanCard from '../components/KanbanCard';

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

    return (
        <div className="kanban-board">
            {statuses.length > 0 ? (
                statuses.map((status) => (
                    <div key={status} className="kanban-column">
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
