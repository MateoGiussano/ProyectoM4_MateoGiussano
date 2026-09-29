export function getAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
      return "Email o contraseña incorrectos.";
    case "auth/invalid-email":
      return "Ese email no tiene un formato válido.";
    case "auth/user-disabled":
      return "Esta cuenta fue deshabilitada.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Probá de nuevo en unos minutos.";
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con ese email.";
    case "auth/weak-password":
      return "La contraseña necesita al menos 6 caracteres.";
    case "auth/network-request-failed":
      return "No se pudo conectar. Revisá tu conexión a internet.";
    default:
      return "Ocurrió un error. Intentá de nuevo.";
  }
}