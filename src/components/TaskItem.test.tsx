import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskItem from "./TaskItem";
import type { Task } from "../types/Task";

const tareaDePrueba: Task = {
  id: "tarea-1",
  userId: "usuario-1",
  title: "Comprar pan",
  description: "En la panadería",
  completed: false,
};

function renderizarItem() {
  const onToggle = vi.fn();
  const onUpdate = vi.fn();
  const onDelete = vi.fn();

  render(
    <ul>
      <TaskItem
        task={tareaDePrueba}
        onToggle={onToggle}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </ul>
  );

  return { onToggle, onUpdate, onDelete };
}

describe("TaskItem", () => {
  it("muestra el título y la descripción de la tarea", () => {
    renderizarItem();

    expect(screen.getByText("Comprar pan")).toBeInTheDocument();
    expect(screen.getByText(/En la panadería/)).toBeInTheDocument();
  });

  it("al tildar el checkbox avisa con el id y el estado contrario", async () => {
    const { onToggle } = renderizarItem();
    const user = userEvent.setup();

    await user.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledWith("tarea-1", true);
  });

  it("al hacer click en Eliminar avisa con el id de la tarea", async () => {
    const { onDelete } = renderizarItem();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /eliminar/i }));

    expect(onDelete).toHaveBeenCalledWith("tarea-1");
  });

  it("permite editar el título y guarda los cambios", async () => {
    const { onUpdate } = renderizarItem();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /editar/i }));

    const inputTitulo = screen.getByDisplayValue("Comprar pan");
    await user.clear(inputTitulo);
    await user.type(inputTitulo, "Comprar leche");
    await user.click(screen.getByRole("button", { name: /guardar/i }));

    expect(onUpdate).toHaveBeenCalledWith(
      "tarea-1",
      "Comprar leche",
      "En la panadería"
    );
  });

  it("no guarda y muestra un error si se deja el título vacío al editar", async () => {
    const { onUpdate } = renderizarItem();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /editar/i }));
    await user.clear(screen.getByDisplayValue("Comprar pan"));
    await user.click(screen.getByRole("button", { name: /guardar/i }));

    expect(
      screen.getByText("Completá el título y la descripción.")
    ).toBeInTheDocument();
    expect(onUpdate).not.toHaveBeenCalled();
  });

     it("al cancelar la edición vuelve a la vista normal sin guardar", async () => {
    const { onUpdate } = renderizarItem();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /editar/i }));
    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(onUpdate).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: /guardar/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /editar/i })).toBeInTheDocument();
  });
});