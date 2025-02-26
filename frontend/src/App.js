import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Kanban from "./pages/Kanban";
import KanbanCard from "./components/KanbanCard";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DynamicTable from "./components/DynamicTable";

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
    <ThemeProvider theme = {theme}>
      <div>
      <h1>Users List</h1>
      <Kanban projectId={projectId} />
      <DynamicTable projectId={projectId} />
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
    </ThemeProvider>
    
  );
}

export default App;
