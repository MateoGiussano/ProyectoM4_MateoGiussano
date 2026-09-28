import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { addTask, deleteTask, toggleTaskCompleted, updateTask } from "../services/tasks";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function TasksPage() {
  const { currentUser } = useAuth();
  const { tasks, loading, error } = useTasks();

  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");

  async function handleLogout() {
    await signOut(auth);
  }

  async function handleCreateTask(title: string, description: string) {
    if (!currentUser) return;
    await addTask(currentUser.uid, title, description);
  }

  function buildSummary() {
    const pendientes = tasks.filter((t) => !t.completed);
    const completadas = tasks.filter((t) => t.completed);

    const listaPendientes = pendientes
      .map((t) => `- ${t.title}: ${t.description}`)
      .join("\n");

    const listaCompletadas = completadas
      .map((t) => `- ${t.title}: ${t.description}`)
      .join("\n");

    return (
      `Pendientes (${pendientes.length}):\n` +
      (pendientes.length > 0 ? listaPendientes : "Ninguna") +
      `\n\nCompletadas (${completadas.length}):\n` +
      (completadas.length > 0 ? listaCompletadas : "Ninguna")
    );
  }

  async function handleSendEmail() {
    if (!currentUser?.email) return;

    setEmailStatus("loading");
    setEmailErrorMsg("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: currentUser.email, summary: buildSummary() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailStatus("error");
        setEmailErrorMsg(data?.message || "Ocurrió un error al enviar el email.");
        return;
      }

      setEmailStatus("success");
    } catch (err) {
      setEmailStatus("error");
      setEmailErrorMsg("No se pudo conectar con el servidor.");
    }
  }

  return (
    <div>
      <h1>Página de Tareas</h1>
      <p>Sesión iniciada como: {currentUser?.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>

      <hr />

      <button onClick={handleSendEmail} disabled={emailStatus === "loading"}>
        {emailStatus === "loading" ? "Enviando..." : "Enviar resumen por email"}
      </button>
      {emailStatus === "success" && <span style={{ color: "green" }}> ¡Email enviado!</span>}
      {emailStatus === "error" && <span style={{ color: "red" }}> {emailErrorMsg}</span>}

      <hr />

      <TaskForm onSubmit={handleCreateTask} />

      <hr />

      {loading && <p>Cargando tareas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <TaskList
          tasks={tasks}
          onToggle={toggleTaskCompleted}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}

export default TasksPage;