import TaskCard from "./TaskCard";

function BoardColumn({
  board,
  tasks,
  setShowTaskModal,
  setSelectedStatus,
  handleDeleteTask,
  handleEditTask,
  handleStatusChange,
  handleOpenComments,
}) {
  return (
    <div className="board-column">
      <h2>{board.title}</h2>

      <button
        className="add-task-btn"
        onClick={() => {
          setShowTaskModal(true);
          setSelectedStatus(board.title);
        }}
      >
        + Add Task
      </button>

      {tasks
        .filter((task) => task.status === board.title)
        .map((task) => (
          <TaskCard
  key={task._id}
  task={task}
  handleDeleteTask={handleDeleteTask}
  handleEditTask={handleEditTask}
  handleStatusChange={handleStatusChange}
handleOpenComments={handleOpenComments}
/>
        ))}
    </div>
  );
}

export default BoardColumn;