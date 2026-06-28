function TaskModal({
  showTaskModal,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  handleCreateTask,
  setShowTaskModal,
  editingTask,
  users,
  assignedTo,
  setAssignedTo,
 dueDate,
  setDueDate,
}) {
  if (!showTaskModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
  {editingTask ? "Edit Task" : "Create Task"}
</h2>

        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />

        <textarea
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
<select
  value={assignedTo}
  onChange={(e) => setAssignedTo(e.target.value)}
>
  <option value="">Assign User</option>

  {users.map((user) => (
    <option key={user._id} value={user._id}>
      {user.name}
    </option>
  ))}
</select>
<input
  type="date"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>
        <div className="modal-buttons">
       <button onClick={handleCreateTask}>
  {editingTask ? "Update" : "Create"}
</button>

          <button onClick={() => setShowTaskModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;