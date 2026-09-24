import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const tasksCollection = collection(db, "tasks");

export function getTasksQuery(userId: string) {
  return query(tasksCollection, where("userId", "==", userId));
}

export async function addTask(userId: string, title: string, description: string) {
  await addDoc(tasksCollection, {
    userId,
    title,
    description,
    completed: false,
  });
}

export async function updateTask(taskId: string, title: string, description: string) {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, { title, description });
}

export async function toggleTaskCompleted(taskId: string, completed: boolean) {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, { completed });
}

export async function deleteTask(taskId: string) {
  const taskRef = doc(db, "tasks", taskId);
  await deleteDoc(taskRef);
}