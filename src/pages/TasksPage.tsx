import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { addTask, deleteTask, toggleTaskCompleted, updateTask } from "../services/tasks";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import EmailSummaryButton from "../components/EmailSummaryButton";

function TasksPage() {
  const { currentUser } = useAuth();
  const { tasks, loading, error } = useTasks();

  const userEmail = currentUser?.email;

  async function handleLogout() {
    await signOut(auth);
  }

  async function handleCreateTask(title: string, description: string) {
    if (!currentUser) return;
    await addTask(currentUser.uid, title, description);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-600">Página de Tareas</h1>
      <p>Sesión iniciada como: {currentUser?.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>

      <hr />

      {userEmail && <EmailSummaryButton tasks={tasks} userEmail={userEmail} />}

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