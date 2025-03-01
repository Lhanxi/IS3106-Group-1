import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Tooltip } from "@mui/material";
import mockTasks from "./mockTasks.json"; // Adjust the path as needed

const Timeline = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Simulate a data fetch
  useEffect(() => {
    // Instead of sampleTasks, you could do:
    // axios.get('/api/tasks').then(res => setTasks(res.data));
    setTasks(mockTasks);
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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
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

        {/* Date Axis */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          {Array.from({ length: 10 }).map((_, index) => {
            const date = new Date(startDate.getTime() + (index * (endDate - startDate) / 9));
            return (
              <Typography key={index} variant="caption">
                {formatDate(date)}
              </Typography>
            );
          })}
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
              {/* The bar itself (blue rectangle) */}
              <Tooltip
                title={
                  <React.Fragment>
                    <Typography color="inherit">Start: {formatDate(new Date(task.startDate))}</Typography>
                    <Typography color="inherit">Due: {formatDate(new Date(task.dueDate))}</Typography>
                    <Typography color="inherit">Description: {task.description}</Typography>
                  </React.Fragment>
                }
              >
                  <Box
                  sx={{
                    position: "absolute",
                    top: 10, // center vertically
                    height: 50,
                    bgcolor: "primary.main",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    ...barStyle,
                  }}
                >
                  <Typography variant="body3">{task.name}</Typography>
                </Box>
              </Tooltip>
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
};

export default Timeline;