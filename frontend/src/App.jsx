import { useEffect, useState } from "react";
import "./styles/App.css";
import Header from "./components/Header";
import Board from "./components/Board";
import AddTaskModal from "./components/AddTaskModal";
import EditTaskModal from "./components/EditTaskModal";

// for api request
import {
  getBoard,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} from "./services/api";

function App() {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add task modal
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  const [savingEdit, setSavingEdit] = useState(false);

  // for deleting task confirmation
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    column_id: 1,
    title: "",
    description: "",
    priority: "Medium",
  });

  const [creating, setCreating] = useState(false);

  // =========================
  // DRAG & DROP STATE
  // =========================

  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [movingTask, setMovingTask] = useState(false);

  // =========================
  // GET BOARD
  // =========================

  const fetchBoard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBoard();

      setBoard(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to TaskFlow backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  // =========================
  // FORM INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREATE TASK
  // =========================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Task title is required.");
      return;
    }

    try {
      setCreating(true);

      const data = await createTask({
        column_id: Number(formData.column_id),
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
      });

      console.log("Task created:", data);

      setShowModal(false);

      setFormData({
        column_id: 1,
        title: "",
        description: "",
        priority: "Medium",
      });

      await fetchBoard();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // EDIT TASK
  // =========================
  const handleEditTask = (task) => {
    setEditingTask(task);

    setEditFormData({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
    });
  };

  //  =========================
  // EDIT FORM INPUT
  // =========================
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // DELETE  TASK
  // =========================
  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  // =========================
  // CONFIRM DELETE TASK
  // =========================
  const handleConfirmDelete = async () => {
    if (!taskToDelete) {
      return;
    }

    try {
      await deleteTask(taskToDelete.id);

      setTaskToDelete(null);

      await fetchBoard();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // =========================
  // UPDATE TASK
  // =========================
  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!editFormData.title.trim()) {
      alert("Task title is required.");
      return;
    }

    if (!editingTask) {
      return;
    }

    try {
      setSavingEdit(true);

      const data = await updateTask(editingTask.id, {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        priority: editFormData.priority,
      });

      console.log("Task updated:", data);

      setEditingTask(null);

      setEditFormData({
        title: "",
        description: "",
        priority: "Medium",
      });

      await fetchBoard();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  // =========================
  // DRAG START
  // =========================

  const handleDragStart = (e, task) => {
    setDraggedTask(task);

    e.dataTransfer.effectAllowed = "move";

    // Store task ID
    e.dataTransfer.setData("text/plain", String(task.id));
  };

  // =========================
  // DRAG END
  // =========================

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  // =========================
  // DRAG OVER COLUMN
  // =========================

  const handleDragOverColumn = (e, columnId) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = "move";

    setDragOverColumn(columnId);
  };

  // =========================
  // DROP ON COLUMN
  // =========================

  const handleDropOnColumn = async (e, columnId, position) => {
    e.preventDefault();

    if (!draggedTask) {
      return;
    }

    // If task is already in same position,
    // don't send unnecessary API request.
    if (
      draggedTask.column_id === columnId &&
      draggedTask.position === position
    ) {
      setDraggedTask(null);
      setDragOverColumn(null);
      return;
    }
    try {
      setMovingTask(true);

      const data = await moveTask(
        draggedTask.id,
        Number(columnId),
        Number(position),
      );

      console.log("Task moved:", data);

      await fetchBoard();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setMovingTask(false);
      setDraggedTask(null);
      setDragOverColumn(null);
    }
  };

  // =========================
  // DROP AFTER LAST TASK
  // =========================

  const handleDropAtEnd = async (e, column) => {
    e.preventDefault();

    if (!draggedTask) {
      return;
    }

    const position = column.tasks?.length || 0;

    await handleDropOnColumn(e, column.id, position);
  };

  // =========================
  // TOTAL TASKS
  // =========================

  const totalTasks =
    board?.columns?.reduce(
      (total, column) => total + (column.tasks?.length || 0),
      0,
    ) || 0;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loader"></div>
          <p>Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button onClick={fetchBoard}>Retry</button>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="app">
      {/* ================= HEADER ================= */}

      <Header
        boardName={board?.name}
        onRefresh={fetchBoard}
        onAddTask={() => setShowModal(true)}
      />

      {/* ================= MAIN ================= */}

      <main className="main">
        <div className="board-header">
          <div>
            <h1>{board?.name}</h1>

            <p>Manage your tasks and track your progress.</p>
          </div>

          <div className="task-summary">{totalTasks} tasks</div>
        </div>

        {/* ================= BOARD ================= */}

        <Board
          columns={board?.columns}
          draggedTask={draggedTask}
          dragOverColumn={dragOverColumn}
          movingTask={movingTask}
          onDragOverColumn={handleDragOverColumn}
          onDropAtEnd={handleDropAtEnd}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDropOnColumn={handleDropOnColumn}
          onAddTask={(columnId) => {
            setFormData({
              column_id: columnId,
              title: "",
              description: "",
              priority: "Medium",
            });
            setShowModal(true);
          }}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      </main>

      {/* ================= ADD TASK MODAL ================= */}

      {showModal && (
        <AddTaskModal
          board={board}
          formData={formData}
          creating={creating}
          onChange={handleChange}
          onSubmit={handleCreateTask}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ================= EDIT TASK MODAL ================= */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          formData={editFormData}
          saving={savingEdit}
          onChange={handleEditChange}
          onSubmit={handleUpdateTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* ================= DELETE TASK MODAL ================= */}
      {taskToDelete && (
        <div
          className="delete-modal-overlay"
          onClick={() => setTaskToDelete(null)}
        >
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">🗑</div>

            <h2>Delete Task?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{taskToDelete.title}</strong>?
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-btn"
                onClick={() => setTaskToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-btn"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
