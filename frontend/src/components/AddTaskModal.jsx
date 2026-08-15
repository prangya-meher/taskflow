import "../styles/Modal.css";

function AddTaskModal({
  board,
  formData,
  creating,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>Create New Task</h2>

            <p>
              Add a new task to your board.
            </p>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>

          {/* Column */}

          <div className="form-group">
            <label>Column</label>

            <select
              name="column_id"
              value={formData.column_id}
              onChange={onChange}
            >
              {board?.columns?.map((column) => (
                <option
                  key={column.id}
                  value={column.id}
                >
                  {column.name}
                </option>
              ))}
            </select>
          </div>


          {/* Title */}

          <div className="form-group">
            <label>Task Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="e.g. Create Login Page"
              autoFocus
            />
          </div>


          {/* Description */}

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Describe the task..."
              rows="4"
            />
          </div>


          {/* Priority */}

          <div className="form-group">
            <label>Priority</label>

            <select
              name="priority"
              value={formData.priority}
              onChange={onChange}
            >
              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>
            </select>
          </div>


          {/* Buttons */}

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-btn"
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create Task"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;