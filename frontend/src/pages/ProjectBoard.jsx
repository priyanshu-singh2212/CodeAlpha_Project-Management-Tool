import "./ProjectBoard.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import TaskModal from "../components/TaskModal";
import CommentModal from "../components/CommentModal";
import socket from "../socket";
import {
  addMemberToProject,
  removeMemberFromProject,
  getProjectById,
} from "../api/projectApi";

function ProjectBoard() {
  const { id } = useParams();

  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [editingTask, setEditingTask] = useState(null);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
const [search, setSearch] = useState("");
const [priorityFilter, setPriorityFilter] = useState("All");
const [statusFilter, setStatusFilter] = useState("All");

  const token = sessionStorage.getItem("token");

  // ================= FETCH =================
  const fetchProject = async () => {
    const res = await getProjectById(id);
    setProject(res.data.project);
  };

  const fetchBoards = async () => {
    const res = await api.get(`/boards/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBoards(res.data.boards);
  };

  const fetchTasks = async () => {
    const res = await api.get(`/tasks/project/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data.tasks);
  };

  const fetchUsers = async () => {
    const res = await api.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchProject();
    fetchBoards();
    fetchTasks();
    fetchUsers();
  }, [id]);

  // ================= SOCKET =================
  useEffect(() => {
    const handleConnect = () => socket.emit("joinProject", id);

    socket.on("connect", handleConnect);

    if (socket.connected) {
      socket.emit("joinProject", id);
    }

    const handleTaskUpdate = (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    };

    socket.on("taskUpdated", handleTaskUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("taskUpdated", handleTaskUpdate);
      socket.emit("leaveProject", id);
    };
  }, [id]);

  // ================= HELPERS =================
  const normalize = (str) => str?.trim().toLowerCase();

  // ================= MEMBERS =================
  const handleAddMember = async () => {
    const res = await addMemberToProject(id, selectedMember);
    setProject(res.data.project);
    setSelectedMember("");
  };

  const handleRemoveMember = async (memberId) => {
    const res = await removeMemberFromProject(id, memberId);
    setProject(res.data.project);
  };

  // ================= TASK HANDLERS =================
  const handleCreateTask = async () => {
    const res = await api.post(
      "/tasks",
      {
        title: taskTitle,
        description: taskDescription,
        status: selectedStatus,
        project: id,
        assignedTo,
        dueDate,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTasks((prev) => [...prev, res.data.task]);
    setShowTaskModal(false);
    setTaskTitle("");
    setTaskDescription("");
    setAssignedTo("");
    setDueDate("");
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setSelectedStatus(task.status);
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  const handleOpenComments = (task) => {
    setSelectedTask(task);
    setShowCommentModal(true);
  };

  const filteredTasks = tasks.filter((task) => {
  const matchSearch =
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description.toLowerCase().includes(search.toLowerCase());

  const matchPriority =
    priorityFilter === "All" || task.priority === priorityFilter;

  const matchStatus =
    statusFilter === "All" || task.status === statusFilter;

  return matchSearch && matchPriority && matchStatus;
});
  // ================= UI =================
   const boardOrder = [
    "Todo",
    "In Progress",
    "Review",
    "Completed",
  ];

  const sortedBoards = boardOrder
    .map((title) => boards.find((b) => b.title === title))
    .filter(Boolean);
  return (
    <div className="board-page">
      <h1>Project Board</h1>

      {/* MEMBERS */}
      <div className="members-section">
        <h3>Members</h3>

        {project?.members
          ?.slice()
          .sort((a, b) => {
            if (project.owner?._id === a._id) return -1;
            if (project.owner?._id === b._id) return 1;
            return 0;
          })
          .map((m) => (
            <div key={m._id} style={{ display: "flex", gap: "10px" }}>
              <span>
                {m.name}{" "}
                {project.owner?._id === m._id && (
                  <b style={{ color: "green" }}>(Owner)</b>
                )}
              </span>

              {project.owner?._id !== m._id && (
                <button onClick={() => handleRemoveMember(m._id)}>
                  Remove
                </button>
              )}
            </div>
          ))}
      </div>

      {/* ADD MEMBER */}
      <div>
        <select
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <button onClick={handleAddMember}>Add Member</button>
      </div>
      <div className="task-filters">

  <input
    type="text"
    placeholder="🔍 Search Task..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={priorityFilter}
    onChange={(e) => setPriorityFilter(e.target.value)}
  >
    <option value="All">All Priority</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="All">All Status</option>
    <option value="Todo">Todo</option>
    <option value="In Progress">In Progress</option>
    <option value="Review">Review</option>
    <option value="Completed">Completed</option>
  </select>

</div>

      {/* BOARDS */}
      <div className="boards-container">
       {sortedBoards.map((board) => (
          <div key={board._id} className="board-column">
            <h3>{board.title}</h3>

            {filteredTasks.filter(
                (task) =>
                  normalize(task.status) === normalize(board.title)
              )
              .map((task) => (
                <div key={task._id} className="task-card">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>

                  <button onClick={() => handleEditTask(task)}>
                    Edit
                  </button>

                  <button onClick={() => handleDeleteTask(task._id)}>
                    Delete
                  </button>

                  <button onClick={() => handleOpenComments(task)}>
                    Comments
                  </button>
                </div>
              ))}

            <button
              onClick={() => {
                setSelectedStatus(board.title);
                setShowTaskModal(true);
              }}
            >
              + Add Task
            </button>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <TaskModal
        showTaskModal={showTaskModal}
        setShowTaskModal={setShowTaskModal}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        dueDate={dueDate}
        setDueDate={setDueDate}
        selectedStatus={selectedStatus}
        handleCreateTask={handleCreateTask}
        editingTask={editingTask}
      />

      <CommentModal
        showCommentModal={showCommentModal}
        setShowCommentModal={setShowCommentModal}
        selectedTask={selectedTask}
      />
    </div>
  );
}

export default ProjectBoard;