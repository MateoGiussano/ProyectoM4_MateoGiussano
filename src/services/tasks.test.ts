import { describe, it, expect, vi, beforeEach } from "vitest";
import { addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import {
  addTask,
  updateTask,
  toggleTaskCompleted,
  deleteTask,
  getTasksQuery,
} from "./tasks";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => "coleccion-tasks"),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn((_db: unknown, _coleccion: string, id: string) => `doc-${id}`),
  query: vi.fn(() => "consulta-falsa"),
  where: vi.fn(() => "filtro-falso"),
}));

vi.mock("./firebase", () => ({
  db: "base-de-datos-falsa",
}));

describe("services/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getTasksQuery filtra las tareas por el userId recibido", () => {
    const resultado = getTasksQuery("usuario-1");

    expect(where).toHaveBeenCalledWith("userId", "==", "usuario-1");
    expect(query).toHaveBeenCalledWith("coleccion-tasks", "filtro-falso");
    expect(resultado).toBe("consulta-falsa");
  });

  it("addTask guarda la tarea con el userId y completed en false", async () => {
    await addTask("usuario-1", "Comprar pan", "En la panadería");

    expect(addDoc).toHaveBeenCalledWith("coleccion-tasks", {
      userId: "usuario-1",
      title: "Comprar pan",
      description: "En la panadería",
      completed: false,
    });
  });

  it("updateTask actualiza solo el título y la descripción de la tarea indicada", async () => {
    await updateTask("tarea-1", "Nuevo título", "Nueva descripción");

    expect(doc).toHaveBeenCalledWith("base-de-datos-falsa", "tasks", "tarea-1");
    expect(updateDoc).toHaveBeenCalledWith("doc-tarea-1", {
      title: "Nuevo título",
      description: "Nueva descripción",
    });
  });

  it("toggleTaskCompleted cambia el campo completed de la tarea indicada", async () => {
    await toggleTaskCompleted("tarea-1", true);

    expect(updateDoc).toHaveBeenCalledWith("doc-tarea-1", { completed: true });
  });

  it("deleteTask elimina la tarea indicada", async () => {
    await deleteTask("tarea-1");

    expect(deleteDoc).toHaveBeenCalledWith("doc-tarea-1");
  });
});