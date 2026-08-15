const API_URL = "http://localhost:5000/api";

export async function getBoard() {
  const response = await fetch(`${API_URL}/board`);

  if (!response.ok) {
    throw new Error("Failed to fetch board");
  }

  return response.json();
}


export async function createTask(task) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create task");
  }

  return data;
}


export async function updateTask(taskId, task) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update task");
  }

  return data;
}


export async function deleteTask(taskId) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete task");
  }

  return data;
}


export async function moveTask(
  taskId,
  columnId,
  position
) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}/move`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        column_id: columnId,
        position,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to move task");
  }

  return data;
}