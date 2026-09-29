import { useState } from "react";
import type { Task } from "../types/Task";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

type EmailSummaryButtonProps = {
  tasks: Task[];
  userEmail: string;
};

function buildSummary(tasks: Task[]) {
  const pendientes = tasks.filter((t) => !t.completed);
  const completadas = tasks.filter((t) => t.completed);

  const listaPendientes = pendientes.map((t) => `- ${t.title}: ${t.description}`).join("\n");
  const listaCompletadas = completadas.map((t) => `- ${t.title}: ${t.description}`).join("\n");

  return (
    `Pendientes (${pendientes.length}):\n` +
    (pendientes.length > 0 ? listaPendientes : "Ninguna") +
    `\n\nCompletadas (${completadas.length}):\n` +
    (completadas.length > 0 ? listaCompletadas : "Ninguna")
  );
}

function EmailSummaryButton({ tasks, userEmail }: EmailSummaryButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSend() {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: userEmail, summary: buildSummary(tasks) }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.message || "Ocurrió un error al enviar el email.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("No se pudo conectar con el servidor.");
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button variant="secondary" onClick={handleSend} disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Enviar resumen por email"}
      </Button>
      {status === "success" && <span className="text-sm text-green-700">¡Email enviado!</span>}
      {status === "error" && <ErrorMessage message={errorMsg} />}
    </div>
  );
}

export default EmailSummaryButton;