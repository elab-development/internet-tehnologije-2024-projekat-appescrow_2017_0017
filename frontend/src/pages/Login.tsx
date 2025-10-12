import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com"); // za brži test
  const [password, setPassword] = useState("password");
  const [err, setErr] = useState<string>("");
  const nav = useNavigate();
  const { login, register } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setErr("");
      await login(email, password);
      nav("/escrows");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  }

  async function onQuickRegister() {
    try {
      setErr("");
      await register("Admin", email, password);
      nav("/escrows");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Register failed");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="px-4 py-2 rounded bg-black text-white">Login</button>
      </form>

      <button className="mt-3 text-sm underline" onClick={onQuickRegister}>
        Nemam nalog — registruj me brzo (dev)
      </button>
    </div>
  );
}
// (koristi email i password iz inputa)