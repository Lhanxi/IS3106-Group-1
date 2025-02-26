import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Kanban from "./pages/Kanban";
import KanbanCard from "./components/KanbanCard";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme();

// test feature, can just delete 
function App() {
  const [users, setUsers] = useState([]);
  const projectId = "67beb08ef0f0ca9e7f6db407"; // temporarily used for testing purposes, free to edit away

  useEffect(() => {
    axios.get("http://localhost:5001/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      <Kanban projectId={projectId} />
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
