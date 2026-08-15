function TaskMenu({
  onEdit,
  onDelete,
}) {
  return (
    <div className="task-menu-dropdown">

      <button
        type="button"
        onClick={onEdit}
      >
        Edit
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="delete-menu-item"
      >
        Delete
      </button>

    </div>
  );
}

export default TaskMenu;