import Column from "./Column";
import "../styles/Board.css";

function Board({
  columns,
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
    <div className="board">

      {columns?.map((column) => (

        <Column
          key={column.id}
          column={column}
          draggedTask={draggedTask}
          dragOverColumn={dragOverColumn}
          movingTask={movingTask}
          onDragOverColumn={onDragOverColumn}
          onDropAtEnd={onDropAtEnd}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDropOnColumn={onDropOnColumn}
          onAddTask={onAddTask}
          onEdit={onEdit}
          onDelete={onDelete}
        />

      ))}

    </div>
  );
}

export default Board;