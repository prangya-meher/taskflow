import "../styles/Header.css";
function Header({ boardName, onRefresh, onAddTask }) {
  return (
    <header className="header">

      <div className="header-left">

  <div className="logo">
    <span className="logo-icon">
      ✓
    </span>

    <span>
      TaskFlow
    </span>
  </div>

</div>

      <div className="header-right">

        <button
          className="refresh-btn"
          onClick={onRefresh}
        >
          ↻ Refresh
        </button>

        <button
          className="add-task-btn"
          onClick={onAddTask}
        >
          + Add Task
        </button>

      </div>

    </header>
  );
}

export default Header;