import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateProjectPage = () => {
  const [projectName, setProjectName] = useState('');
  const [people, setPeople] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);

  // Fetch the list of people (users) available for selection
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get('/api/users/users'); // Replace with your API to get users
        setPeople(response.data); // Assuming the response is an array of users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchPeople();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProject = {
      name: projectName,
      people: selectedPeople,
      tasks: [], // Optionally, initialize with default tasks
    };

    try {
      // Send request to create the project
      const response = await axios.post('api/projects/new-project', newProject);
      console.log('Project created:', response.data);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div>
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Select People:</label>
          <select
            multiple
            value={selectedPeople}
            onChange={(e) => setSelectedPeople(Array.from(e.target.selectedOptions, option => option.value))}
          >
            {people.map((person) => (
              <option key={person._id} value={person._id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProjectPage;
