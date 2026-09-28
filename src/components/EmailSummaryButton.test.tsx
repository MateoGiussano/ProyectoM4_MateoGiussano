import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmailSummaryButton from "./EmailSummaryButton";
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

const fetchFalso = vi.fn();

function renderizarBoton() {
  render(<EmailSummaryButton tasks={tareas} userEmail="mateo@ejemplo.com" />);
  return userEvent.setup();
}

describe("EmailSummaryButton", () => {
  beforeEach(() => {
    fetchFalso.mockReset();
    vi.stubGlobal("fetch", fetchFalso);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("envía el resumen al endpoint y muestra el mensaje de éxito", async () => {
    fetchFalso.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    const user = renderizarBoton();

    await user.click(screen.getByRole("button", { name: /enviar resumen/i }));

    expect(await screen.findByText("¡Email enviado!")).toBeInTheDocument();

    const [url, opciones] = fetchFalso.mock.calls[0];
    expect(url).toBe("/api/send-email");
    expect(opciones.method).toBe("POST");
    expect(JSON.parse(opciones.body)).toEqual({
      to: "mateo@ejemplo.com",
      summary:
        "Pendientes (1):\n- Comprar pan: En la panadería\n\nCompletadas (1):\n- Estudiar: Terminar el módulo 4",
    });
  });

  it("muestra el mensaje del servidor si el endpoint responde con error", async () => {
    fetchFalso.mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, message: "Email address is not verified." }),
    });
    const user = renderizarBoton();

    await user.click(screen.getByRole("button", { name: /enviar resumen/i }));

    expect(
      await screen.findByText("Email address is not verified.")
    ).toBeInTheDocument();
    expect(screen.queryByText("¡Email enviado!")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar resumen/i })).toBeEnabled();
  });

  it("muestra un mensaje genérico si el error no trae detalle", async () => {
    fetchFalso.mockResolvedValue({ ok: false, json: async () => ({}) });
    const user = renderizarBoton();

    await user.click(screen.getByRole("button", { name: /enviar resumen/i }));

    expect(
      await screen.findByText("Ocurrió un error al enviar el email.")
    ).toBeInTheDocument();
  });

  it("muestra un error de conexión si el fetch falla del todo", async () => {
    fetchFalso.mockRejectedValue(new Error("Failed to fetch"));
    const user = renderizarBoton();

    await user.click(screen.getByRole("button", { name: /enviar resumen/i }));

    expect(
      await screen.findByText("No se pudo conectar con el servidor.")
    ).toBeInTheDocument();
  });

  it("deshabilita el botón y muestra 'Enviando...' mientras espera la respuesta", async () => {
    let resolverRespuesta: (valor: unknown) => void = () => {};
    const respuestaPendiente = new Promise((resolve) => {
      resolverRespuesta = resolve;
    });
    fetchFalso.mockReturnValue(respuestaPendiente);
    const user = renderizarBoton();

    await user.click(screen.getByRole("button", { name: /enviar resumen/i }));

    expect(screen.getByRole("button", { name: /enviando/i })).toBeDisabled();

    resolverRespuesta({ ok: true, json: async () => ({ ok: true }) });
    expect(await screen.findByText("¡Email enviado!")).toBeInTheDocument();
  });
});