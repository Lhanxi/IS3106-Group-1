import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate }) => {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-200">
      <button onClick={() => onNavigate("PREV")} className="p-2">
        ⬅️
      </button>
      <span className="font-bold">{label}</span>
      <button onClick={() => onNavigate("NEXT")} className="p-2">
        ➡️
      </button>
    </div>
  );
};

const CustomCalendar = () => {
  const [meetings, setMeetings] = useState([]);
  const [tasks, setTasks] = useState([]); // Filtered tasks, my own tasks
  const [allTasks, setAllTasks] = useState([]); // Store all tasks
  const [showOnlyMine, setShowOnlyMine] = useState(true);
  const [userId, setUserId] = useState("67d05e4525b159e2208e275f"); // Simulated logged-in user
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchMeetings();
    fetchAllTasks();
  }, []);

  //  Fetch meetings created by or involving the user
  const fetchMeetings = async () => {
    try {
      const response = await axios.get("/api/meetings");
      setMeetings(
        response.data.map((meeting) => ({
          id: meeting._id,
          title: `📅 ${meeting.agenda[0] || "Meeting"}`,
          start: new Date(meeting.date),
          end: new Date(meeting.date),
          createdBy: meeting.createdBy,
          type: "meeting",
        }))
      );
    } catch (err) {
      console.error("Error fetching meetings:", err);
    }
  };

  //  Fetch all tasks (not just the user’s)
  const fetchAllTasks = async () => {
    try {
      const response = await axios.get("/api/tasks"); // Fetch all tasks
      const formattedTasks = response.data.map((task) => ({
        id: task._id,
        title: `TASK: ${task.name}`,
        start: new Date(task.startDate || task.dueDate),
        end: new Date(task.dueDate || task.startDate),
        createdBy: task.createdBy,
        type: "task",
      }));

      setAllTasks(formattedTasks); // Store all tasks
      setTasks(formattedTasks.filter((task) => task.createdBy === userId)); // Initially show only user tasks
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  //  Toggle between only my tasks & all tasks
  const handleToggleTasks = () => {
    // setShowOnlyMine((prev) => !prev); // Toggle state
    setShowOnlyMine((prev) => {
      const newValue = !prev;
      setTasks(
        newValue
          ? allTasks.filter((task) => task.createdBy === userId)
          : allTasks
      );
      return newValue;
    });

    if (showOnlyMine) {
      setTasks(allTasks); // Show all tasks when unchecked
    } else {
      setTasks(allTasks.filter((task) => task.createdBy === userId)); // Show only user's tasks
    }
  };

  //  Combine meetings and tasks for the calendar
  const combinedEvents = [...meetings, ...tasks];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl">Calendar</h2>
        <label>
          <input
            type="checkbox"
            checked={showOnlyMine}
            onChange={handleToggleTasks} //  Call toggle function
          />
          Show only my tasks
        </label>
      </div>

      <Calendar
        localizer={localizer}
        events={combinedEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        views={["month", "week", "day", "agenda"]}
        defaultView="month"
        view={view}
        onView={(newView) => setView(newView)}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        style={{ height: 500 }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.type === "task" ? "lightblue" : "lightgreen",
          },
        })}
      />
    </div>
  );
};

export default CustomCalendar;
