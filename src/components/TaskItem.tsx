import { useState } from "react";
import type { Task } from "../types/Task";

type TaskItemProps = {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onUpdate: (taskId: string, title: string, description: string) => Promise<void>;
  onDelete: (taskId: string) => void;
};

function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [error, setError] = useState("");

  function handleStartEdit() {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setError("");
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  async function handleSave() {
    if (!editTitle.trim() || !editDescription.trim()) {
      setError("Completá el título y la descripción.");
      return;
    }

    await onUpdate(task.id, editTitle.trim(), editDescription.trim());
    setIsEditing(false);
  }

  return (
    <li>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <button onClick={handleSave}>Guardar</button>
          <button onClick={handleCancel}>Cancelar</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id, !task.completed)}
          />
          <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            <strong>{task.title}</strong> — {task.description}
          </span>
          <button onClick={handleStartEdit}>Editar</button>
          <button onClick={() => onDelete(task.id)}>Eliminar</button>
        </>
      )}
    </li>
  );
}

export default TaskItem;