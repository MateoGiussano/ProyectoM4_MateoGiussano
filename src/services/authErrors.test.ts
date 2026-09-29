import { describe, it, expect } from "vitest";
import { getAuthErrorMessage } from "./authErrors";

describe("getAuthErrorMessage", () => {
  it("devuelve el mensaje de credenciales incorrectas para auth/invalid-credential", () => {
    expect(getAuthErrorMessage("auth/invalid-credential")).toBe(
      "Email o contraseña incorrectos."
    );
  });

  it("devuelve el mensaje de email en uso para auth/email-already-in-use", () => {
    expect(getAuthErrorMessage("auth/email-already-in-use")).toBe(
      "Ya existe una cuenta con ese email."
    );
  });

  it("devuelve el mensaje de contraseña débil para auth/weak-password", () => {
    expect(getAuthErrorMessage("auth/weak-password")).toBe(
      "La contraseña necesita al menos 6 caracteres."
    );
  });

  it("devuelve un mensaje genérico para un código que no reconoce", () => {
    expect(getAuthErrorMessage("auth/codigo-inventado")).toBe(
      "Ocurrió un error. Intentá de nuevo."
    );
  });
});