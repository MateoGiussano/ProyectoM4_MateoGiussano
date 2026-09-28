import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskList from "./TaskList";
import type { Task } from "../types/Task";

const tareas: Task[] = [
  {
    id: "1",
    userId: "usuario-1",
    title: "Comprar pan",
    description: "En la panadería",
    completed: false,
  },
  {
    id: "2",
    userId: "usuario-1",
    title: "Estudiar",
    description: "Terminar el módulo 4",
    completed: true,
  },
];

describe("TaskList", () => {
  it("muestra un mensaje cuando no hay tareas", () => {
    render(
      <TaskList tasks={[]} onToggle={vi.fn()} onUpdate={vi.fn()} onDelete={vi.fn()} />
    );

    expect(
      screen.getByText("Todavía no tenés tareas. ¡Creá la primera!")
    ).toBeInTheDocument();
  });

  it("muestra una fila por cada tarea", () => {
    render(
      <TaskList tasks={tareas} onToggle={vi.fn()} onUpdate={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("Comprar pan")).toBeInTheDocument();
    expect(screen.getByText("Estudiar")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("al eliminar la segunda tarea avisa con el id de esa tarea", async () => {
    const onDelete = vi.fn();
    render(
      <TaskList tasks={tareas} onToggle={vi.fn()} onUpdate={vi.fn()} onDelete={onDelete} />
    );
    const user = userEvent.setup();

    const botonesEliminar = screen.getAllByRole("button", { name: /eliminar/i });
    await user.click(botonesEliminar[1]);

    expect(onDelete).toHaveBeenCalledWith("2");
  });
});