import { useState } from "react";
import type { FormEvent } from "react";

type TaskFormProps = {
  onSubmit: (title: string, description: string) => Promise<void>;
};

function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Completá el título y la descripción.");
      return;
    }

    setError("");
    await onSubmit(title.trim(), description.trim());
    setTitle("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Agregar tarea</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default TaskForm;