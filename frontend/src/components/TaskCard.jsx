import { useState } from "react";
import TaskMenu from "./TaskMenu";
import "../styles/TaskCard.css";

function TaskCard({
  task,
  index,
  columnId,
  draggedTask,
  movingTask,
  onDragStart,
  onDragEnd,
  onDropOnColumn,
  onEdit,
  onDelete,
}) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleEdit = () => {
    setShowMenu(false);
    onEdit(task);
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete(task);
  };

  return (
    <div
      className={`task-card ${
        draggedTask?.id === task.id ? "task-dragging" : ""
      }`}
      draggable={!movingTask}
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();

        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();

        onDropOnColumn(e, columnId, index);
      }}
    >
      <div className="task-card-top">
        <span className={`priority priority-${task.priority?.toLowerCase()}`}>
          {task.priority}
        </span>

        <div className="task-menu-wrapper">
          <div className="task-actions">
            <button
              className="task-action edit-action"
              onClick={() => onEdit(task)}
              title="Edit task"
            >
              ✎
            </button>

            <button
              type="button"
              className="task-action delete-action"
              onClick={handleDelete}
              title="Delete task"
            >
              🗑
            </button>
          </div>

          {showMenu && <TaskMenu onEdit={handleEdit} onDelete={handleDelete} />}
        </div>
      </div>

      <h3>{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        {/* <span>
          #{task.id}
        </span> */}

        <span>Position {task.position + 1}</span>
      </div>
    </div>
  );
}

export default TaskCard;
