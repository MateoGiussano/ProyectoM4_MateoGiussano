import { useState } from "react";
import type { FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { getAuthErrorMessage } from "../services/authErrors";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import ErrorMessage from "../components/ErrorMessage";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      setError(getAuthErrorMessage(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="px-4 py-4 sm:px-6">
        <p className="text-xl font-bold tracking-tight text-blue-700">MateDo</p>
      </header>

      <main className="mx-auto mt-8 w-full max-w-sm px-4 sm:mt-16">
        <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-stone-500">Entrá para ver tus tareas.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <TextInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextInput
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <ErrorMessage message={error} />

          <Button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-stone-500">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-blue-700 hover:underline">
            Registrate
          </Link>
        </p>
      </main>
    </div>
  );
}

export default LoginPage;