import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import KanbanCard from "./components/KanbanCard";
import ForumPage from "./pages/FourmPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Timeline from "./pages/Timeline";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        {/* Routes Setup */}
        <Routes>
          <Route path="/" element={<Login />} /> // Default route for login
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/forumposts" element={<ForumPage />} />
          <Route
            path="*"
            element={<Navigate to="/" replace />} // Redirects any unknown routes to Login
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Kanban from "./pages/Kanban";
// import KanbanCard from "./components/KanbanCard";
// import mongoose from "mongoose";
// App.use(express.json()); // do i need this?

// App.get("/", cors(), (req, res) => {
// });

// App.post("/", async(req, res) => {
//   const {email, password} = req.body;
  
//   try{
//     const check=await mongoose.model("User").findOne({email: email}); // need to fix this

//     if (check){
//       res.json({message: "User already exists"});
//     } else {
//       res.json({message: "User does not exist"});
//     }
//   }catch(e){
//     res.json({message: "Error"});
//   }
// })

// App.post("/signup", async(req, res) => {
//   const {email, password} = req.body;
  
//   const user = new mongoose.model("User")({
//     email: email,
//     password: password
//   });

//   try{
//     const check=await mongoose.model("User").findOne({email: email});

//     if (check){
//       res.json({message: "User already exists"});
//     } else {
//       res.json({message: "User does not exist"});
//       await mongoose.model("User").create(user);
//     }
//   }catch(e){
//     res.json({message: "Error"});
//   }
// })

// App.listen(5000, () => {
//   console.log("Server has started");
// });

// // test feature, can just delete 
// function App() {
//   const [users, setUsers] = useState([]);
//   const projectId = "67beb08ef0f0ca9e7f6db407"; // temporarily used for testing purposes, free to edit away

//   useEffect(() => {
//     axios.get("http://localhost:5001/api/users")
//       .then((res) => setUsers(res.data))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div>
//       <h1>Users List</h1>
//       <Kanban projectId={projectId} />
//       <ul>
//         {users.map((user) => (
//           <li key={user._id}>{user.name} - {user.email}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
