import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { addTask, deleteTask, toggleTaskCompleted, updateTask } from "../services/tasks";
import Button from "../components/Button";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import EmailSummaryButton from "../components/EmailSummaryButton";

function TasksPage() {
  const { currentUser } = useAuth();
  const { tasks, loading, error } = useTasks();

  const userEmail = currentUser?.email;
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  async function handleLogout() {
    await signOut(auth);
  }

  async function handleCreateTask(title: string, description: string) {
    if (!currentUser) return;
    await addTask(currentUser.uid, title, description);
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between border-b border-stone-200 px-4 py-4 sm:px-6">
        <p className="text-xl font-bold tracking-tight text-blue-700">MateDo</p>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-stone-500 sm:inline">{userEmail}</span>
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
        {totalCount > 0 && (
          <div className="mb-6">
            <p className="text-sm text-stone-500">
              {completedCount} de {totalCount} completadas
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-blue-700 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {userEmail && (
          <div className="mb-6">
            <EmailSummaryButton tasks={tasks} userEmail={userEmail} />
          </div>
        )}

        <div className="mb-6 border-b border-stone-200 pb-6">
          <TaskForm onSubmit={handleCreateTask} />
        </div>

        {loading && <p className="text-sm text-stone-500">Cargando tareas...</p>}
        {error && <p className="text-sm text-red-800">{error}</p>}

        {!loading && !error && (
          <TaskList
            tasks={tasks}
            onToggle={toggleTaskCompleted}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        )}
      </main>
    </div>
  );
}

export default TasksPage;