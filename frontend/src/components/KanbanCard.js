import React from 'react'; 
import "../pages/Kanban.css";

const KanbanCard = ({ task = {} }) => {  // Default to an empty object if task is undefined
    return (
        <div className="card border shadow-sm p-3 mb-2 bg-white" style={{ maxWidth: "300px" }}>
            <div className="card-body">
                <h5 className="card-title">{task.title || "Untitled Task"}</h5>  {/* Default Title */}
                <p className="card-text">{task.description || "No description available."}</p>  {/* Default Description */}
                <span className="badge bg-secondary">{task.status || "Unknown Status"}</span>  {/* Default Status */}
            </div>
        </div>
    );
}

export default KanbanCard;
