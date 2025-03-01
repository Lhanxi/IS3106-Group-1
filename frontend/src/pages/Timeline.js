import React, { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";

/** Example mock data. Replace with your actual tasks or fetched data */
const sampleTasks = [
  {
    _id: "1",
    name: "Task 1",
    startDate: "2025-03-01T00:00:00.000Z",
    dueDate:   "2025-03-10T00:00:00.000Z",
  },
  {
    _id: "2",
    name: "Task 2",
    startDate: "2025-03-05T00:00:00.000Z",
    dueDate:   "2025-03-15T00:00:00.000Z",
  },
  {
    _id: "3",
    name: "Task 3",
    startDate: "2025-03-10T00:00:00.000Z",
    dueDate:   "2025-03-20T00:00:00.000Z",
  },
  {
    _id: "4",
    name: "Task 4",
    startDate: "2025-03-15T00:00:00.000Z",
    dueDate:   "2025-03-25T00:00:00.000Z",
  },
  {
    _id: "5",
    name: "Task 5",
    startDate: "2025-03-20T00:00:00.000Z",
    dueDate:   "2025-03-30T00:00:00.000Z",
  },
  {
    _id: "6",
    name: "Task 6",
    startDate: "2025-03-25T00:00:00.000Z",
    dueDate:   "2025-04-05T00:00:00.000Z",
  },
  {
    _id: "7",
    name: "Task 7",
    startDate: "2025-03-30T00:00:00.000Z",
    dueDate:   "2025-04-10T00:00:00.000Z",
  },
  {
    _id: "8",
    name: "Task 8",
    startDate: "2025-04-01T00:00:00.000Z",
    dueDate:   "2025-04-15T00:00:00.000Z",
  },
];

export default function Timeline() {
  const [tasks, setTasks] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Simulate a data fetch
  useEffect(() => {
    // Instead of sampleTasks, you could do:
    // axios.get('/api/tasks').then(res => setTasks(res.data));
    setTasks(sampleTasks);
  }, []);

  // Compute earliest start & latest end
  useEffect(() => {
    if (!tasks.length) return;

    const earliest = tasks.reduce((acc, t) => {
      const d = new Date(t.startDate);
      return d < acc ? d : acc;
    }, new Date(tasks[0].startDate));

    const latest = tasks.reduce((acc, t) => {
      const d = new Date(t.dueDate);
      return d > acc ? d : acc;
    }, new Date(tasks[0].dueDate));

    setStartDate(earliest);
    setEndDate(latest);
  }, [tasks]);

  // Convert each task's start/end to a left offset & width in %
  const calculateBarPosition = (task) => {
    if (!startDate || !endDate) return {};
    const totalDuration = endDate - startDate;
    const taskStart = new Date(task.startDate) - startDate;
    const taskLength = new Date(task.dueDate) - new Date(task.startDate);

    const leftPct = (taskStart / totalDuration) * 100;
    const widthPct = (taskLength / totalDuration) * 100;

    return {
      left: `${leftPct}%`,
      width: `${widthPct}%`,
    };
  };

  if (!startDate || !endDate) {
    return <Typography>Loading timeline...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Project Timeline
      </Typography>

      <Paper elevation={2} sx={{ p: 2 }}>
        {/* Timeline Header: Start date and End date */}
        <Box
          display="flex"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="subtitle1">
            {startDate.toDateString()}
          </Typography>
          <Typography variant="subtitle1">
            {endDate.toDateString()}
          </Typography>
        </Box>

        {/* The actual timeline rows */}
        {tasks.map((task) => {
          const barStyle = calculateBarPosition(task);

          return (
            <Box
              key={task._id}
              sx={{
                position: "relative",
                mb: 3,
                height: 40, // each row's height
              }}
            >
              {/* Task Name (absolutely positioned at the top-left of its row) */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  bgcolor: "#fff",
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 1,
                  px: 1,
                }}
              >
                <Typography variant="body2">
                  {task.name}
                </Typography>
              </Box>

              {/* The bar itself (blue rectangle) */}
              <Box
                sx={{
                  position: "absolute",
                  top: 20, // move it below the label
                  height: 20,
                  bgcolor: "primary.main",
                  borderRadius: 1,
                  ...barStyle,
                }}
              />
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
}
