import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

function TasksPage() {
  const { currentUser } = useAuth();

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div>
      <h1>Página de Tareas</h1>
      <p>Sesión iniciada como: {currentUser?.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default TasksPage;