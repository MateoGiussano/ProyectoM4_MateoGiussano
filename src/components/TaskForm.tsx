import { useState } from "react";
import type { FormEvent } from "react";
import Button from "./Button";
import TextInput from "./TextInput";
import ErrorMessage from "./ErrorMessage";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <TextInput
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="sm:flex-1"
        />
        <TextInput
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="sm:flex-1"
        />
        <Button type="submit" className="shrink-0">
          Agregar tarea
        </Button>
      </div>
      <ErrorMessage message={error} />
    </form>
  );
}

export default TaskForm;