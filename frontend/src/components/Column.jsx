import TaskCard from "./TaskCard";
import "../styles/Column.css";

function Column({
  column,
  draggedTask,
  dragOverColumn,
  movingTask,
  onDragOverColumn,
  onDropAtEnd,
  onDragStart,
  onDragEnd,
  onDropOnColumn,
  onAddTask,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className={`column ${
        dragOverColumn === column.id
          ? "column-drag-over"
          : ""
      }`}
      onDragOver={(e) =>
        onDragOverColumn(e, column.id)
      }
      onDrop={(e) =>
        onDropAtEnd(e, column)
      }
    >

      {/* Column Header */}

      <div className="column-header">

        <div className="column-title">

          <h2>
            {column.name}
          </h2>

          <span className="task-count">
            {column.tasks?.length || 0}
          </span>

        </div>

        {/* <button className="column-menu">
          ⋮
        </button> */}

      </div>


      {/* Tasks */}

      <div className="tasks">

        {column.tasks?.length > 0 ? (

          column.tasks.map((task, index) => (

            <TaskCard
              key={task.id}
              task={task}
              index={index}
              columnId={column.id}
              draggedTask={draggedTask}
              movingTask={movingTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDropOnColumn={onDropOnColumn}
              onEdit={onEdit}
              onDelete={onDelete}
            />

          ))

        ) : (

          <div className="empty-column">
            <p>No tasks</p>
          </div>

        )}

      </div>


      {/* Drop Zone */}

      <div
        className="drop-zone"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();

          onDragOverColumn(
            e,
            column.id
          );
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();

          onDropAtEnd(
            e,
            column
          );
        }}
      >
        {draggedTask
          ? "Drop task here"
          : ""}
      </div>


      {/* Add Task */}

      <button
        className="add-column-task"
        onClick={() =>
          onAddTask(column.id)
        }
      >
        + Add task
      </button>

    </div>
  );
}

export default Column;