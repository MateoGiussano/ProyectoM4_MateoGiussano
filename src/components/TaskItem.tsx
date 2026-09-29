import { useState } from "react";
import type { Task } from "../types/Task";
import Button from "./Button";
import TextInput from "./TextInput";
import ErrorMessage from "./ErrorMessage";

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
    <li className="group py-3">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <TextInput
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="sm:flex-1"
            />
            <TextInput
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="sm:flex-1"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>Guardar</Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
          <ErrorMessage message={error} />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id, !task.completed)}
            className="h-4 w-4 shrink-0 accent-blue-700"
          />
          <p className="min-w-0 flex-1 truncate text-sm">
            <span
              className={
                task.completed ? "text-stone-400 line-through" : "font-medium text-stone-800"
              }
            >
              {task.title}
            </span>{" "}
            <span className="text-stone-500">— {task.description}</span>
          </p>
          <div className="flex shrink-0 gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <Button variant="secondary" onClick={handleStartEdit}>
              Editar
            </Button>
            <Button variant="danger" onClick={() => onDelete(task.id)}>
              Eliminar
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}

export default TaskItem;