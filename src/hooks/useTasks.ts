import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import type { Task } from "../types/Task";
import { getTasksQuery } from "../services/tasks";
import { useAuth } from "../context/AuthContext";

export function useTasks() {
  const { currentUser } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = getTasksQuery(currentUser.uid);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nuevasTareas = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];

        setTasks(nuevasTareas);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("No se pudieron cargar las tareas.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  return { tasks, loading, error };
}