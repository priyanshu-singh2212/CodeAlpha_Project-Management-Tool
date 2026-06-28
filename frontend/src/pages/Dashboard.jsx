import "./Dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import api from "../api/axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";
function Dashboard() {
  const [showModal, setShowModal] = useState(false);
 const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [projects, setProjects] = useState([]);
const navigate = useNavigate();
const [stats, setStats] = useState({
  totalProjects: 0,
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  inProgressTasks: 0,
  totalUsers: 0,
});

const handleCreateProject = async () => {

  try {

    const token = sessionStorage.getItem("token");

    const res = await api.post(
      "/projects",
      {
        title,
        description
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Project created successfully");

    await fetchProjects();

    setTitle("");
    setDescription("");

    setShowModal(false);

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );

  }

};
const fetchProjects = async () => {

  try {

    const token = sessionStorage.getItem("token");

    const res = await api.get(
      "/projects",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setProjects(res.data.projects);

  }

  catch (error) {

    console.log(error);

  }

};
const fetchStats = async () => {
  try {
    const res = await api.get("/dashboard", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    setStats(res.data.stats);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {

  fetchProjects();
  fetchStats();

}, []);

{!stats ? (
  <div>Loading stats...</div>
) : (
  <>
    {/* stats + charts */}
  </>
)}

const pieData = [
  { name: "Todo", value: stats.todoTasks },
  { name: "Review", value: stats.reviewTasks },
  { name: "In Progress", value: stats.inProgressTasks },
  { name: "Completed", value: stats.completedTasks },
];

const barData = [
  { name: "Projects", value: stats.totalProjects },
  { name: "Tasks", value: stats.totalTasks },
  { name: "Users", value: stats.totalUsers },
];

const COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#22c55e"];

  return (

    <div className="dashboard">
      <div className="navbar">
     
  <h2>Project Management Tool </h2>

  <div className="flex items-center gap-4">
    <NotificationBell />

    <button>Logout</button>
  </div>
</div>
 <div className="stats-container">

  <div className="stat-card">Projects<br />{stats.totalProjects}</div>
  <div className="stat-card">Tasks<br />{stats.totalTasks}</div>

  <div className="stat-card">Todo<br />{stats.todoTasks}</div>
  <div className="stat-card">Review<br />{stats.reviewTasks}</div>
  <div className="stat-card">In Progress<br />{stats.inProgressTasks}</div>
  <div className="stat-card">Completed<br />{stats.completedTasks}</div>

  <div className="stat-card">Users<br />{stats.totalUsers}</div>

</div>

  <div className="charts-container">

  <div style={{ width: "400px", height: "300px" }}>
    <h3>Task Distribution</h3>

    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={pieData} dataKey="value" outerRadius={100}>
          {pieData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div style={{ width: "400px", height: "300px" }}>
    <h3>Overview</h3>

    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={barData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  </div>

</div>

      <div className="dashboard-content">
        <h1>Welcome to Dashboard</h1>

       <button onClick={() => setShowModal(true)}>
  Create New Project
</button>

{
  showModal && (
    <div className="modal-overlay">

      <div className="modal">

        <h2>Create Project</h2>

    <input
  type="text"
  placeholder="Project Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

      <textarea
  placeholder="Project Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
></textarea>

        <div className="modal-buttons">

          <button onClick={handleCreateProject}>
  Create
</button>

          <button
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  )
}
<div className="projects-container">

  {projects.map((project) => (

    <div className="project-card" key={project._id}>

      <h3>{project.title}</h3>

      <p>{project.description}</p>

      <button
  onClick={() => navigate(`/project/${project._id}`)}
>
  Open Project
</button>

<div className="project-buttons">

  

  <button
    onClick={() => navigate(`/activity/${project._id}`)}
  >
    View Activity
  </button>

</div>

    </div>

  ))}

</div>
      </div>

    </div>
  );

 
}

export default Dashboard;