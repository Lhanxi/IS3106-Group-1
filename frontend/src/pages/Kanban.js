import * as React from 'react';
import KanbanCard from '../components/KanbanCard';
import './Kanban.css';

const Kanban = () => {
    //get the different statuses from the backend 
    const [statuses, setStatuses] = useState([]); 

    //get all the tasks from the backend
    const [tasks, setTasks] = useState([]);


    useEffect(() => {
        //gets the different statuses from the backend
        const getStatuses = async () => {
            try {
                const response = axios.get(`http://localhost:5000/api/tasks/${projectId}/statuses`); 
                setStatuses(response.data);
            } catch (error) {
                console.error("Error fetching the statuses", error); 
            }
        }; 

        if (projectId) {
            getStatuses();
        }
    }, [projectId]);


    useEffect(() => {
        const getTasks = async () => {
            try {
                const tasks = axios.get(`http://localhost:5000/api/tasks/${projectId}/tasks`); 
                setTasks(response.data); 
            } catch (error) {
                console.error("Error fetching tasks", error); 
            }
        }; 

        if (projectId) {
            getTasks();
        }
    }, [projectId]);  

    return ( 
        <div className="kanban-board">
        {statuses.map((status) => (
            <div key={status} className="kanban-column">
                <h3>{status}</h3>
                <div className="kanban-tasks">
                    {tasks
                        .filter(task => task.status === status)
                        .map(task => (
                            <KanbanCard key={task._id} task={task} />
                        ))}
                </div>
            </div>
        ))}
    </div>
    );
}