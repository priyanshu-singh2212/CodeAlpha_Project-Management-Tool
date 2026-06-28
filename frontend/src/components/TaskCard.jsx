function TaskCard({
  task,
  handleDeleteTask,
  handleEditTask,
  handleStatusChange,
  handleOpenComments,
}) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Completed";

  return (
    <div className="task-card">
      <h4>{task.title}</h4>

      <p>{task.description}</p>

      <p>
        <strong>Assigned To:</strong>{" "}
        {task.assignedTo?.name || "Unassigned"}
      </p>

      {task.dueDate && (
        <p>
          <strong>Due Date:</strong>{" "}
          {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {isOverdue && (
        <p
          style={{
            color: "red",
            fontWeight: "bold",
            marginTop: "5px",
          }}
        >
          ⚠ Overdue
        </p>
      )}

      <select
        value={task.status}
        onChange={(e) =>
          handleStatusChange(task._id, e.target.value)
        }
      >
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Review">Review</option>
        <option value="Completed">Completed</option>
      </select>

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
  );
}

export default TaskCard;