import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "./TaskForm";

describe("TaskForm", () => {
  it("muestra un error y no crea la tarea si el formulario está vacío", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(
      screen.getByText("Completá el título y la descripción.")
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("muestra un error si el título y la descripción son solo espacios", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Título"), "   ");
    await user.type(screen.getByPlaceholderText("Descripción"), "   ");
    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(
      screen.getByText("Completá el título y la descripción.")
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("llama a onSubmit con el título y la descripción cuando están completos", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Título"), "Comprar pan");
    await user.type(screen.getByPlaceholderText("Descripción"), "En la panadería");
    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(onSubmit).toHaveBeenCalledWith("Comprar pan", "En la panadería");
  });
});