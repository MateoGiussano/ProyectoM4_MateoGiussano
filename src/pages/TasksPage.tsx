import { useState } from "react";
import type { FormEvent } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { addTask, deleteTask, toggleTaskCompleted, updateTask } from "../services/tasks";

function TasksPage() {
  const { currentUser } = useAuth();
  const { tasks, loading, error } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  async function handleLogout() {
    await signOut(auth);
  }

  async function handleCreateTask(e: FormEvent) {
    e.preventDefault();
    if (!currentUser) return;

    await addTask(currentUser.uid, title, description);
    setTitle("");
    setDescription("");
  }

  function handleStartEdit(taskId: string, currentTitle: string, currentDescription: string) {
    setEditingTaskId(taskId);
    setEditTitle(currentTitle);
    setEditDescription(currentDescription);
  }

  function handleCancelEdit() {
    setEditingTaskId(null);
  }

  async function handleSaveEdit(taskId: string) {
    await updateTask(taskId, editTitle, editDescription);
    setEditingTaskId(null);
  }

  return (
    <div>
      <h1>Página de Tareas</h1>
      <p>Sesión iniciada como: {currentUser?.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>

      <hr />

      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Agregar tarea</button>
      </form>

      <hr />

      {loading && <p>Cargando tareas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && tasks.length === 0 && (
        <p>Todavía no tenés tareas. ¡Creá la primera!</p>
      )}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
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
                <button onClick={() => handleSaveEdit(task.id)}>Guardar</button>
                <button onClick={handleCancelEdit}>Cancelar</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompleted(task.id, !task.completed)}
                />
                <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                  <strong>{task.title}</strong> — {task.description}
                </span>
                <button onClick={() => handleStartEdit(task.id, task.title, task.description)}>
                  Editar
                </button>
                <button onClick={() => deleteTask(task.id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasksPage;